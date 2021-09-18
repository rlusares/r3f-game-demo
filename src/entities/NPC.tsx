import React from 'react';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import Moveable from '../@core/Moveable';
import Sprite from '../@core/Sprite';
import CameraFollowScript from '../components/CameraFollowScript';
import CharacterScript from '../components/CharacterScript';
import NPCScript from '../components/NPCScript';
import spriteData from '../spriteData';

export default function NPC(props: GameObjectProps) {
    return (
        <GameObject name="npc" displayName="NPC" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <CharacterScript>
                <Sprite {...spriteData.player} />
            </CharacterScript>
            <NPCScript />
        </GameObject>
    );
}
