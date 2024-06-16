'use client'
import React, { Suspense, useEffect as UseEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
const page = () => {
  if (typeof window == "undefined" && typeof Audio == 'undefined') { return }
  var mixer=false
  const Scene = new THREE.Scene()
  const Renderer = new THREE.WebGLRenderer()
  const Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 100000)
  Camera.position.x = 70
  const orbit = new OrbitControls(Camera, Renderer.domElement)
  orbit.update()
  Renderer.setSize(window.innerWidth, window.innerHeight)
  const CubeTexture = new THREE.CubeTextureLoader()
  // Scene.background = CubeTexture.load([
  //   '/pngegg.png',
  //   '/sky.jpg',
  //   '/sky.jpg',
  //   '/sky.jpg',
  //   '/sky.jpg',
  //   '/sky.jpg'
  // ])
  const RGBE=new RGBELoader()
  RGBE.load('/clouds.hdr',(imaged)=>{
    imaged.mapping=THREE.EquirectangularReflectionMapping
 
    Scene.background=imaged
    Scene.environment=imaged
  })
  const Textureloader = new THREE.TextureLoader()
  const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 4)
  Scene.add(AmbientLight)
  const modelloader = new GLTFLoader()
  modelloader.load('/fighter.glb', (data) => {
    data.scene.position.x = 60
    const animationclips=data.animations
    // console.log(animationclips)
    const mix= new THREE.AnimationMixer(data.scene)
    const clip=THREE.AnimationClip.findByName(animationclips,'Animation')
   
    const action=mix.clipAction(clip)
    action.play()
    Scene.add(data.scene)
    mixer=mix
  })
  const pointLight = new THREE.PointLight('#f0bf7f', 100000, 30000);
  Scene.add(pointLight);
  const clock=new THREE.Clock()
  UseEffect(() => {
    function animate() {
      if(mixer){
      mixer.update(clock.getDelta())
      }
      Renderer.render(Scene, Camera)
    }
    Renderer.setAnimationLoop(animate)

    document.getElementById('myobject').appendChild(Renderer.domElement)
  }, [])
  return (
    <Suspense>
      <div id='myobject'>
        <button className='mybtn' onClick={() => audio.play()}>Play</button>
      </div>
    </Suspense>
  )
}

export default page