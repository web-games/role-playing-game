import './assets/style.css'

// import "phaser";
import { Main } from './scenes/Main';

const game = new Phaser.Game({
    type: Phaser.AUTO,
    transparent: true,
    autoFocus: true,
    scale: {
        // zoom: Phaser.Scale.Zoom.ZOOM_2X,
        mode: Phaser.Scale.FIT,
        parent: 'Box',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Main
    ]
});