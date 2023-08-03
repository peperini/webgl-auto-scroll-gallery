import { Mesh, Program, Texture } from 'ogl'

import fragment from 'shaders/fragment.glsl'
import vertex from 'shaders/vertex.glsl'

export default class Media {
    constructor ({ element, geo, gl, scene, screen, viewport }) {
        this.element = element
        this.image = this.element.querySelector('img')

        this.geo = geo
        this.gl = gl
        this.scene = scene
        this.screen = screen
        this.viewport = viewport
    }
}