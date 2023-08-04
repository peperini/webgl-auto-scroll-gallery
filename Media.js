import { Mesh, Program, Texture } from 'ogl'

import fragment from '/shaders/fragment.glsl'
import vertex from '/shaders/vertex.glsl'

export default class {
    constructor ({ element, geo, gl, scene, screen, viewport }) {
        this.element = element
        this.image = this.element.querySelector('img')

        this.geo = geo
        this.gl = gl
        this.scene = scene
        this.screen = screen
        this.viewport = viewport

        this.createMesh()
        this.createBounds()

        this.onResize()
    }

    createMesh () {
        const image = new Image()
        const texture = new Texture(this.gl)

        image.src = this.image.src
        image.onload = () => {
            texture.image = image
        }

        const program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uScreenSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] }
            },
            transparent: true
        })

        this.plane = new Mesh(this.gl, {
            geometry: this.geo,
            program
        })

        this.plane.setParent(this.scene)
    }

    createBounds () {
        this.bounds = this.element.getBoundingClientRect()

        this.updateScale()
        this.updateX()
        this.updateY()
    }

    updateScale () {
        this.plane.scale.x = this.viewport.width * this.bounds.width / this.screen.width
        this.plane.scale.y = this.viewport.height * this.bounds.height / this.screen.height
    }

    updateX (x = 0) {
        this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + ((this.bounds.left - x) / this.screen.width) * this.viewport.width
    }

    updateY (y = 0) {
        this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - ((this.bounds.top - y) / this.screen.height) * this.viewport.height
    }

    update (y) {
        this.updateScale()
        this.updateX()
        this.updateY(y)
    }

    onResize (sizes) {
        if (sizes) {
          const { screen, viewport } = sizes
       
          if (screen) this.screen = screen
          if (viewport) this.viewport = viewport
        }
       
        this.createBounds()
    }
}