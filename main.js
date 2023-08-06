import { Renderer, Camera, Transform, Plane } from 'ogl'
import NormalizeWheel from 'normalize-wheel'
import { lerp } from '/math'

import Media from '/Media'

class App {
    constructor () {
        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0
        }

        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.createGallery()

        this.onResize()

        this.createGeometry()
        this.createMedias()

        this.update()

        this.addEventListeners()
    }

    createGallery () {
        this.gallery = document.querySelector('.demo__gallery')
    }

    createRenderer () {
        this.renderer = new Renderer({
            alpha: true
        });

        this.gl = this.renderer.gl
        
        document.body.appendChild(this.gl.canvas)
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 2;
    }

    createScene () {
        this.scene = new Transform()
    }

    createGeometry () {
        this.planeGeometry = new Plane(this.gl)
    }
      
    createMedias () {
        this.mediasElements = document.querySelectorAll('.demo__gallery__media')
        this.medias = Array.from(this.mediasElements).map(element => {
            let media = new Media({
                element,
                geometry: this.planeGeometry,
                gl: this.gl,
                height: this.galleryHeight,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport
            })
        
            return media
        })
    }


    // Wheel

    onWheel (event) {
        const normalized = NormalizeWheel(event)
        const speed = normalized.pixelY

        this.scroll.target += speed * 0.5
    }


    // Resize

    onResize () {
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth
        }

        this.renderer.setSize(this.screen.width, this.screen.height)

        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height
        })

        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect

        this.viewport = {
            height,
            width
        }

        this.galleryBounds = this.gallery.getBoundingClientRect()
        this.galleryHeight = this.viewport.height * this.galleryBounds.height /this.screen.height

        if (this.medias) {
            this.medias.forEach(media => media.onResize({
                height: this.galleryHeight,
                screen: this.screen,
                viewport: this.viewport
            }))
        }
    }


    // Update

    update () {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

        if (this.scroll.current > this.scroll.last) {
            this.direction = 'down'
        } else if (this.scroll.current < this.scroll.last) {
            this.direction = 'up'
        }

        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll.current, this.direction))
        }

        this.renderer.render({
            scene: this.scene,
            camera: this.camera
        })

        this.scroll.last = this.scroll.current

        window.requestAnimationFrame(this.update.bind(this))
    }


    // Listeners

    addEventListeners () {
        window.addEventListener('resize', this.onResize.bind(this))
     
        window.addEventListener('mousewheel', this.onWheel.bind(this))
        window.addEventListener('wheel', this.onWheel.bind(this))
    }
}

new App()