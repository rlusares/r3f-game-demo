/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
import React, { useEffect, useState } from 'react';
import { Position } from '../@core/GameObject';
import { InteractableRef } from '../@core/Interactable';
import { MoveableRef } from '../@core/Moveable';
import useCollisionTest from '../@core/useCollisionTest';
import useGameLoop from '../@core/useGameLoop';
import useGameObject from '../@core/useGameObject';
import usePointer from '../@core/usePointer';
import usePointerClick from '../@core/usePointerClick';
import tileUtils from '../@core/utils/tileUtils';
import PlayerPathOverlay from './PlayerPathOverlay';
import { allowedPos } from '../scenes/mapdata/officemap';

export default function PlayerScript() {
    const { getComponent, transform } = useGameObject();
    const testCollision = useCollisionTest();
    const [path, setPath] = useState<Position[]>([]);
    const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);

    let horizontalMovement = 0;
    let verticalMovement = 0;

    const allowedMovement = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    useGameLoop(() => {
        const delayInMilliseconds = 1000;

        setTimeout(function() {
            const movement =
                allowedMovement[Math.floor(Math.random() * allowedMovement.length)];

            horizontalMovement = movement[0];
            verticalMovement = movement[1];
        }, delayInMilliseconds);

        const direction = {
            x: horizontalMovement,
            y: verticalMovement,
        };

        const nextPosition = tileUtils(transform).add(direction);
        // is same position?
        if (tileUtils(nextPosition).equals(transform)) return;

        // is already moving?
        if (!getComponent<MoveableRef>('Moveable').canMove()) return;

        // will cut corner?
        const horizontal = { ...transform, x: nextPosition.x };
        const vertical = { ...transform, y: nextPosition.y };
        const canCross =
            direction.x !== 0 && direction.y !== 0
                ? // test diagonal movement
                  testCollision(horizontal) && testCollision(vertical)
                : true;

        if (canCross) {
            setPath([nextPosition]);
            setPathOverlayEnabled(false);
        }
    });

    // mouse controls
    const pointer = usePointer();

    usePointerClick(() => {});

    // walk the path
    useEffect(() => {
        if (!path.length) return;

        const [nextPosition] = path;

        (async () => {
            const anyAction =
                (await getComponent<MoveableRef>('Moveable')?.move(nextPosition)) ||
                (path.length === 1 && // try interaction on last step of path
                    (await getComponent<InteractableRef>('Interactable')?.interact(
                        nextPosition
                    )));

            if (anyAction) {
                // proceed with next step in path
                setPath(current => current.slice(1));
            }
        })();
    }, [path, getComponent]);

    return (
        <PlayerPathOverlay
            path={path}
            pathVisible={pathOverlayEnabled}
            pointer={pointer}
        />
    );
}
