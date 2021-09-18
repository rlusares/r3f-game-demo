import React, { Fragment } from 'react';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import CoffeeMachine from '../entities/CoffeeMachine';
import PizzaPickup from '../entities/PizzaPickup';
import Plant from '../entities/Plant';
import Player from '../entities/Player';
import NPC from '../entities/NPC';
import Workstation from '../entities/Workstation';
import OtherDoor from '../entities/OtherDoor';
import spriteData from '../spriteData';
import { allowedPos } from './mapdata/officemap';

const mapData = mapDataString(`
# # # # # # # # # # # # # # # # #
# · W T # T · · W T · W · · · T #
# · · · · · · · · · · · · · · o D
# o · · # · · · # # # # · · # # #
# # # # # · · · # W o W · · T W #
# C C C # · · · T · · · · · · · #
# o · · · · · · · · · · · · · o #
# # # # # # D # # # # # # # # # #
`);

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };

    const floor = (
        <GameObject key={key} {...position} layer="ground">
            <Sprite {...spriteData.objects} state="floor" />
        </GameObject>
    );

    switch (type) {
        case '·':
            return floor;
        case 'o':
            return (
                <Fragment key={key}>
                    {floor}
                    <PizzaPickup {...position} />
                </Fragment>
            );
        case '#':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.objects} state="wall" />
                </GameObject>
            );
        case 'W':
            return (
                <Fragment key={key}>
                    {floor}
                    <Workstation {...position} />
                </Fragment>
            );
        case 'C':
            return (
                <Fragment key={key}>
                    {floor}
                    <CoffeeMachine {...position} />
                </Fragment>
            );
        case 'T':
            return (
                <Fragment key={key}>
                    {floor}
                    <Plant {...position} />
                </Fragment>
            );
        case 'D':
            return (
                <Fragment key={key}>
                    {floor}
                    <OtherDoor {...position} />
                </Fragment>
            );
        default:
            return null;
    }
};

export default function OfficeScene() {
    return (
        <>
            <GameObject name="map">
                <ambientLight />
                <TileMap data={mapData} resolver={resolveMapTile} definesMapSize />
            </GameObject>
            <GameObject x={16} y={5}>
                <Collider />
                <Interactable />
                <ScenePortal name="exit" enterDirection={[-1, 0]} target="other/start" />
            </GameObject>
            <GameObject x={6} y={0}>
                <Collider />
                <Interactable />
                <ScenePortal
                    name="exitRoomTwo"
                    enterDirection={[0, 1]}
                    target="roomtwo/start"
                />
            </GameObject>
            <Player x={6} y={3} />
            <NPC x={6} y={2} />
            <NPC x={7} y={3} />
            <NPC x={2} y={5} />
        </>
    );
}
