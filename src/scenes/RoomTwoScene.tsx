import React from 'react';
import { MoveDirection } from 'src/@core/Moveable';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import Player from '../entities/Player';
import spriteData from '../spriteData';
import { roommapdata, roomdoor, roomdoordirection } from './mapdata/roomtwomap';

const mapData = mapDataString(roommapdata);
const roomDoorEntrance = roomdoor;
const roomEnterDirection = (roomdoordirection as unknown) as MoveDirection;

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };

    switch (type) {
        case '·':
            return (
                <GameObject key={key} {...position} layer="ground">
                    <Sprite {...spriteData.objects} state="floor" />
                </GameObject>
            );
        case '#':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.objects} state="wall" />
                </GameObject>
            );
        default:
            return null;
    }
};

export default function RoomTwoScene() {
    return (
        <>
            <GameObject name="map">
                <ambientLight />
                <TileMap data={mapData} resolver={resolveMapTile} definesMapSize />
            </GameObject>
            <GameObject x={roomDoorEntrance.x} y={roomDoorEntrance.y}>
                <Collider />
                <Interactable />
                <ScenePortal
                    name="start"
                    enterDirection={roomEnterDirection}
                    target="office/exitRoomTwo"
                />
            </GameObject>
            <Player x={roomdoor.x} y={roomdoor.y} />
        </>
    );
}
