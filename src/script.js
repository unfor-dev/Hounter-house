import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Sky} from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loader elements
const loaderElement = document.querySelector('.loader')
const loaderBar = document.querySelector('.loader-bar')
const loaderPercent = document.querySelector('.loader-percent')

// Loading Manager
const loadingManager = new THREE.LoadingManager(
    // onLoad - hammasi yuklanganda
    () => {
        // 99% da 1 sekund kutish, keyin 100%
        setTimeout(() => {
            loaderPercent.textContent = '100%'
            loaderBar.style.setProperty('--progress', '100%')

            // 100% ko'rsatib, keyin yashirish
            setTimeout(() => {
                loaderElement.classList.add('hidden')
            }, 500)
        }, 1000)
    },
    // onProgress - har bir fayl yuklanganda
    (url, loaded, total) => {
        const progress = Math.min(Math.floor((loaded / total) * 99), 99)
        loaderPercent.textContent = progress + '%'
        loaderBar.style.setProperty('--progress', progress + '%')
    }
)

// Textures
const textureLoader = new THREE.TextureLoader(loadingManager)

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/textures-4/brick_villa_floor_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/textures-4/brick_villa_floor_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/textures-4/brick_villa_floor_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/textures-4/brick_villa_floor_disp_1k.jpg')


floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(1, 1)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallsColorTexture = textureLoader.load('./walls/textures-2/plaster_brick_pattern_diff_1k.jpg')
const wallsARMTexture = textureLoader.load('./walls/textures-2/plaster_brick_pattern_arm_1k.jpg')
const wallsNormalTexture = textureLoader.load('./walls/textures-2/plaster_brick_pattern_nor_gl_1k.jpg')

wallsColorTexture.colorSpace = THREE.SRGBColorSpace

wallsColorTexture.repeat.set(2, 2)
wallsARMTexture.repeat.set(2, 2)
wallsNormalTexture.repeat.set(2, 2)

wallsColorTexture.wrapS = THREE.RepeatWrapping
wallsARMTexture.wrapS = THREE.RepeatWrapping
wallsNormalTexture.wrapS = THREE.RepeatWrapping

wallsColorTexture.wrapT = THREE.RepeatWrapping
wallsARMTexture.wrapT = THREE.RepeatWrapping
wallsNormalTexture.wrapT = THREE.RepeatWrapping

// Roof
const roofColorTexture = textureLoader.load('./roof/textures-1/clay_roof_tiles_02_diff_1k.jpg')
const roofARMTexture = textureLoader.load('./roof/textures-1/clay_roof_tiles_02_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof/textures-1/clay_roof_tiles_02_nor_gl_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./bush/textures-2/forest_leaves_03_diff_1k.jpg')
const bushARMTexture = textureLoader.load('./bush/textures-2/forest_leaves_03_arm_1k.jpg')
const bushNormalTexture = textureLoader.load('./bush/textures-2/forest_leaves_03_nor_gl_1k.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Graves
const graveColorTexture = textureLoader.load('./grave/textures-1/dry_riverbed_rock_diff_1k.jpg')
const graveARMTexture = textureLoader.load('./grave/textures-1/dry_riverbed_rock_arm_1k.jpg')
const graveNormalTexture = textureLoader.load('./grave/textures-1/dry_riverbed_rock_nor_gl_1k.jpg')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbienOcclusiontTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace



/**
 * House
 */

// House Measures
const houseMeasures = {
    width: 4,
    height: 2.5,
    debth: 4
}
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: - 0.2,
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasures.width, 2.5, 4),
    new THREE.MeshStandardMaterial({
        color: 'white',
        map: wallsColorTexture,
        aoMap: wallsARMTexture,
        roughnessMap: wallsARMTexture,
        metalnessMap: wallsARMTexture,
        normalMap: wallsNormalTexture
    })
)
walls.position.y = houseMeasures.height / 2
house.add(walls)


// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25      // 0.8
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbienOcclusiontTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementScale: 0.15,
        displacementBias: - 0.04,
    })
)
door.position.y = 1
door.position.z = 2 + 0.001
house.add(door)

// Bushes - butalar, qalin o't,yantoq // sphere - dumaloq shape
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap:bushARMTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
// bush1.position.x = 0.8  // Manashuni qisqa varianti
// bush1.position.y = 0.2
// bush1.position.z = 2.2
bush1.position.set(0.8, 0.2, 2.2) // manashu qisqa varianti
bush1.scale.set(0.5, 0.5, 0.5)
bush1.rotation.x = -0.85

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.85

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)
bush3.rotation.x = -0.85

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)
bush4.rotation.x = -0.85
house.add(bush1, bush2, bush3, bush4)

// Grave Group
const graves = new THREE.Group()
scene.add(graves)

// Graver - qabirlar, qabr toshlar
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap:graveARMTexture,
    normalMap: graveNormalTexture,
})

for(let i = 0; i < 30; i++){
    // Random
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    graves.position.y = Math.PI * 0.1
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius


    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.04
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.position.z = z
    // add to grave group for scene
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light - qorong'uroq
const ambientLight = new THREE.AmbientLight('#4466aa', 0.15)
scene.add(ambientLight)

// Directional light - oy nuri
const directionalLight = new THREE.DirectionalLight('#6688cc', 0.8)
directionalLight.position.set(-5, 8, -10)
scene.add(directionalLight)

// Hemisphere light - osmon va yer orasida gradient
const hemisphereLight = new THREE.HemisphereLight('#334477', '#110511', 0.3)
scene.add(hemisphereLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 7)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

// Ghost light
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 15)
scene.add(ghost1, ghost2, ghost3)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Y limit (vertical) - yerga kirmasin, osmonga ko'p ko'tarilmasin
controls.minPolarAngle = Math.PI * 0.1    // yuqoriga limit (tepadan ko'rish)
controls.maxPolarAngle = Math.PI * 0.45 // pastga limit (yerga tushmasin)

// Z limit (zoom/distance) - juda yaqin yoki uzoqlashmasin
controls.minDistance = 4    // eng yaqin
controls.maxDistance = 15   // eng uzoq

// Pan (2 barmoq bilan surish) o'chirish
controls.enablePan = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Shadow
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
//Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true

roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children){
    grave.castShadow = true
    grave.receiveShadow = true
}

//Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

// Sky - qop-qora tungi osmon
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)
sky.material.uniforms['turbidity'].value = 20
sky.material.uniforms['rayleigh'].value = 0.1
sky.material.uniforms['mieCoefficient'].value = 0.001
sky.material.uniforms['mieDirectionalG'].value = 0.7
sky.material.uniforms['sunPosition'].value.set(0.3, -0.15, -0.95)

// Fog - qorong'u to'q ko'k tuman
scene.fog = new THREE.FogExp2('#0a0812', 0.06)

// Stars - real ko'rinishli oq yulduzlar (fog ta'sir qilmaydi)
const starsGeometry = new THREE.BufferGeometry()
const starsCount = 1500
const starsPositions = new Float32Array(starsCount * 3)

for(let i = 0; i < starsCount; i++){
    const i3 = i * 3

    // Sfera bo'ylab tekis taqsimlash
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)

    // Faqat yuqori yarim sfera (osmon)
    const radius = 50

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = Math.abs(radius * Math.cos(phi)) // faqat yuqori
    const z = radius * Math.sin(phi) * Math.sin(theta)

    // Faqat y > 8 bo'lganlarni olish (ufq ostida ko'rinmasin)
    if(y > 8) {
        starsPositions[i3] = x
        starsPositions[i3 + 1] = y
        starsPositions[i3 + 2] = z
    } else {
        // Qayta joylashtirish yuqoriga
        starsPositions[i3] = (Math.random() - 0.5) * 80
        starsPositions[i3 + 1] = 20 + Math.random() * 40
        starsPositions[i3 + 2] = (Math.random() - 0.5) * 80
    }
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))

// Real oq yulduzlar - fog ta'sir qilmaydigan material
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
    fog: false  // FOG TA'SIR QILMAYDI!
})

const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

// Shooting stars - uchuvchi yulduzlar
const shootingStarsGroup = new THREE.Group()
scene.add(shootingStarsGroup)

const shootingStarGeometry = new THREE.BufferGeometry()
const shootingStarPositions = new Float32Array(30 * 3) // 30 nuqta trail uchun
shootingStarGeometry.setAttribute('position', new THREE.BufferAttribute(shootingStarPositions, 3))

const shootingStarMaterial = new THREE.LineBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.8
})

// Shooting star ma'lumotlari
const shootingStarsData = []
for(let i = 0; i < 5; i++){
    const line = new THREE.Line(shootingStarGeometry.clone(), shootingStarMaterial.clone())
    line.visible = false
    shootingStarsGroup.add(line)
    shootingStarsData.push({
        line: line,
        active: false,
        progress: 0,
        startPos: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        speed: 0,
        nextSpawn: Math.random() * 10 + 5
    })
}

// Oy (Moon)
const moonGeometry = new THREE.SphereGeometry(2, 32, 32)
const moonMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            // Oy rangi
            vec3 moonColor = vec3(0.95, 0.93, 0.88);

            // Kraterlar effekti
            float crater1 = smoothstep(0.1, 0.15, length(vUv - vec2(0.3, 0.4)));
            float crater2 = smoothstep(0.05, 0.08, length(vUv - vec2(0.6, 0.3)));
            float crater3 = smoothstep(0.07, 0.1, length(vUv - vec2(0.5, 0.6)));

            moonColor *= crater1 * 0.1 + 0.9;
            moonColor *= crater2 * 0.1 + 0.9;
            moonColor *= crater3 * 0.1 + 0.9;

            // Qirra yorug'ligi
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.0);
            moonColor += rim * 0.3;

            gl_FragColor = vec4(moonColor, 1.0);
        }
    `
})

const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.position.set(-30, 25, -50)
scene.add(moon)

// Oy atrofida glow
const moonGlowGeometry = new THREE.SphereGeometry(3.5, 32, 32)
const moonGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glowColor = vec3(0.6, 0.7, 0.9);
            gl_FragColor = vec4(glowColor, intensity * 0.5);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
})

const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial)
moonGlow.position.copy(moon.position)
scene.add(moonGlow)

// Fireflies - sirli, chiroyli o'tqizlar
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 40
const firefliesPositions = new Float32Array(firefliesCount * 3)
const firefliesScales = new Float32Array(firefliesCount)
const firefliesSpeed = new Float32Array(firefliesCount)

for(let i = 0; i < firefliesCount; i++){
    const i3 = i * 3
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 5
    firefliesPositions[i3] = Math.sin(angle) * radius
    firefliesPositions[i3 + 1] = 0.3 + Math.random() * 1.5
    firefliesPositions[i3 + 2] = Math.cos(angle) * radius
    firefliesScales[i] = 0.5 + Math.random() * 0.5
    firefliesSpeed[i] = 0.5 + Math.random() * 1.5
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(firefliesPositions, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(firefliesScales, 1))
firefliesGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(firefliesSpeed, 1))

const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 80 }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        attribute float aScale;
        attribute float aSpeed;
        varying float vAlpha;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            // Yumshoq harakatlar
            float t = uTime * aSpeed;
            modelPosition.y += sin(t * 1.5) * 0.3;
            modelPosition.x += cos(t * 0.8) * 0.2;
            modelPosition.z += sin(t * 0.6) * 0.2;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            // O'lcham
            gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);
            gl_PointSize = max(gl_PointSize, 2.0);

            // Miltillash alpha
            vAlpha = (sin(t * 3.0) * 0.5 + 0.5) * 0.7 + 0.3;
        }
    `,
    fragmentShader: `
        varying float vAlpha;

        void main() {
            // Yumshoq dumaloq shakl
            float dist = length(gl_PointCoord - vec2(0.5));
            if(dist > 0.5) discard;

            // Markazda yorqin, chetda yumshoq
            float strength = 1.0 - (dist * 2.0);
            strength = pow(strength, 2.0);

            // Issiq sariq-yashil rang
            vec3 color = mix(
                vec3(0.4, 0.8, 0.2),  // yashil
                vec3(1.0, 0.9, 0.5),  // sariq
                strength
            );

            gl_FragColor = vec4(color, strength * vAlpha);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false
})

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

// Qora bulutlar - dark clouds
const cloudGeometry = new THREE.PlaneGeometry(15, 8, 1, 1)
const cloudMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.4 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float smoothNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for(int i = 0; i < 5; i++) {
                value += amplitude * smoothNoise(p);
                p *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }

        void main() {
            vec2 uv = vUv;
            uv.x += uTime * 0.02;

            float n = fbm(uv * 3.0);
            n = smoothstep(0.3, 0.7, n);

            // Qora/kulrang bulut
            vec3 color = vec3(0.05, 0.05, 0.08);

            float alpha = n * uOpacity * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
            alpha *= smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

            gl_FragColor = vec4(color, alpha);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
})

// Bir nechta bulut qo'shish
const clouds = []
for(let i = 0; i < 6; i++) {
    const cloud = new THREE.Mesh(cloudGeometry.clone(), cloudMaterial.clone())
    const angle = (i / 6) * Math.PI * 2
    const radius = 30 + Math.random() * 20
    cloud.position.set(
        Math.cos(angle) * radius,
        12 + Math.random() * 8,
        Math.sin(angle) * radius
    )
    cloud.rotation.y = angle + Math.PI
    cloud.scale.set(1 + Math.random() * 0.5, 1 + Math.random() * 0.3, 1)
    clouds.push(cloud)
    scene.add(cloud)
}

// Yerdan ko'tariluvchi tuman - ground fog
const groundFogGeometry = new THREE.PlaneGeometry(40, 40, 1, 1)
const groundFogMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float smoothNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
            vec2 uv = vUv;
            uv += uTime * 0.03;

            float n = smoothNoise(uv * 4.0) * 0.5 + smoothNoise(uv * 8.0) * 0.25;

            // Markazdan chetga kamayish
            float dist = length(vUv - 0.5) * 2.0;
            float fade = 1.0 - smoothstep(0.3, 1.0, dist);

            vec3 fogColor = vec3(0.15, 0.1, 0.2);
            float alpha = n * fade * 0.35;

            gl_FragColor = vec4(fogColor, alpha);
        }
    `,
    transparent: true,
    depthWrite: false
})

const groundFog = new THREE.Mesh(groundFogGeometry, groundFogMaterial)
groundFog.rotation.x = -Math.PI * 0.5
groundFog.position.y = 0.3
scene.add(groundFog)

// Qabr toshlar atrofida glow - eerie grave glow
const graveGlowGeometry = new THREE.PlaneGeometry(1.5, 1.5)
const graveGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#1a4d1a') }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
            float dist = length(vUv - 0.5) * 2.0;
            float glow = 1.0 - smoothstep(0.0, 1.0, dist);
            glow = pow(glow, 3.0);
            float pulse = sin(uTime * 2.0) * 0.3 + 0.7;
            gl_FragColor = vec4(uColor * pulse, glow * 0.3 * pulse);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
})

// Tasodifiy qabrlarga glow qo'shish
const graveGlows = []
for(let i = 0; i < 8; i++) {
    const graveGlow = new THREE.Mesh(graveGlowGeometry.clone(), graveGlowMaterial.clone())
    const angle = Math.random() * Math.PI * 2
    const radius = 3.5 + Math.random() * 3.5
    graveGlow.position.set(
        Math.sin(angle) * radius,
        0.05,
        Math.cos(angle) * radius
    )
    graveGlow.rotation.x = -Math.PI * 0.5
    // Har xil yashil/ko'k ranglar
    const hue = 0.3 + Math.random() * 0.2
    graveGlow.material.uniforms.uColor.value.setHSL(hue, 0.6, 0.3)
    graveGlows.push(graveGlow)
    scene.add(graveGlow)
}

// Uy derazalaridan yorug'lik - window lights
const windowLightGeometry = new THREE.PlaneGeometry(0.4, 0.5)
const windowLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
            // Qizil-to'q sariq ichki yorug'lik
            vec3 color = vec3(0.9, 0.3, 0.1);

            // Miltillash
            float flicker = sin(uTime * 8.0) * 0.1 + sin(uTime * 13.0) * 0.05 + 0.85;

            // Deraza chetlarini soft qilish
            float edgeX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
            float edgeY = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
            float alpha = edgeX * edgeY * flicker;

            gl_FragColor = vec4(color * flicker, alpha * 0.9);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})

// Yon devorlarga derazalar
const windowLight1 = new THREE.Mesh(windowLightGeometry, windowLightMaterial)
windowLight1.position.set(2.01, 1.5, 0.5)
windowLight1.rotation.y = Math.PI * 0.5
house.add(windowLight1)

const windowLight2 = new THREE.Mesh(windowLightGeometry, windowLightMaterial.clone())
windowLight2.position.set(2.01, 1.5, -0.5)
windowLight2.rotation.y = Math.PI * 0.5
house.add(windowLight2)

const windowLight3 = new THREE.Mesh(windowLightGeometry, windowLightMaterial.clone())
windowLight3.position.set(-2.01, 1.5, 0)
windowLight3.rotation.y = -Math.PI * 0.5
house.add(windowLight3)

// Orqa devorga deraza
const windowLight4 = new THREE.Mesh(windowLightGeometry, windowLightMaterial.clone())
windowLight4.position.set(0, 1.5, -2.01)
windowLight4.rotation.y = Math.PI
house.add(windowLight4)



/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update shader uniforms (stars are static now)
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    moonMaterial.uniforms.uTime.value = elapsedTime
    groundFogMaterial.uniforms.uTime.value = elapsedTime

    // Bulutlar animatsiyasi
    for(const cloud of clouds) {
        cloud.material.uniforms.uTime.value = elapsedTime
    }

    // Qabr glowlari animatsiyasi
    for(const glow of graveGlows) {
        glow.material.uniforms.uTime.value = elapsedTime
    }

    // Deraza yorug'liklari
    windowLight1.material.uniforms.uTime.value = elapsedTime
    windowLight2.material.uniforms.uTime.value = elapsedTime
    windowLight3.material.uniforms.uTime.value = elapsedTime
    windowLight4.material.uniforms.uTime.value = elapsedTime

    // Door light pulsating effect - miltillovchi chiroq
    const doorPulse = Math.sin(elapsedTime * 3) * 0.5 + Math.sin(elapsedTime * 7) * 0.2 + 0.8
    doorLight.intensity = 5 + doorPulse * 4
    doorLight.color.setHSL(0.05 + Math.sin(elapsedTime * 2) * 0.02, 0.9, 0.5)

    // Shooting stars animation
    for(const starData of shootingStarsData){
        if(!starData.active){
            starData.nextSpawn -= 0.016
            if(starData.nextSpawn <= 0){
                // Yangi shooting star boshlash
                starData.active = true
                starData.progress = 0
                starData.speed = 0.5 + Math.random() * 0.5

                // Tasodifiy boshlang'ich pozitsiya (yuqori o'ng tomonda)
                starData.startPos.set(
                    10 + Math.random() * 30,
                    20 + Math.random() * 15,
                    -20 - Math.random() * 30
                )

                // Pastga chapga yo'nalish
                starData.direction.set(
                    -1 - Math.random() * 0.5,
                    -0.5 - Math.random() * 0.3,
                    0.2
                ).normalize()

                starData.line.visible = true
            }
        } else {
            starData.progress += starData.speed * 0.016

            if(starData.progress >= 1){
                starData.active = false
                starData.line.visible = false
                starData.nextSpawn = 5 + Math.random() * 15
            } else {
                // Trail pozitsiyalarini yangilash
                const positions = starData.line.geometry.attributes.position.array
                const trailLength = 3

                for(let i = 0; i < 30; i++){
                    const t = i / 30
                    const pos = starData.startPos.clone().add(
                        starData.direction.clone().multiplyScalar(starData.progress * 50 - t * trailLength)
                    )
                    positions[i * 3] = pos.x
                    positions[i * 3 + 1] = pos.y
                    positions[i * 3 + 2] = pos.z
                }

                starData.line.geometry.attributes.position.needsUpdate = true
                starData.line.material.opacity = 1 - starData.progress
            }
        }
    }

    // Ghost
    const ghost1Angle = elapsedTime * 0.4
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    // Ghost rang o'zgarishi
    ghost1.color.setHSL(0.75 + Math.sin(elapsedTime) * 0.1, 1, 0.5)

    const ghost2Angle = elapsedTime * - 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 2) * 0.5

    ghost2.color.setHSL(0.9 + Math.sin(elapsedTime * 1.5) * 0.05, 1, 0.5)

    const ghost3Angle = elapsedTime * 1
    ghost3.position.x = Math.cos(ghost3Angle) * 7
    ghost3.position.z = Math.sin(ghost3Angle) * 7
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 1.34) * Math.sin(ghost3Angle * 1.45)

    // Ghost intensity pulsing
    ghost1.intensity = 4 + Math.sin(elapsedTime * 5) * 2
    ghost2.intensity = 4 + Math.sin(elapsedTime * 4) * 2
    ghost3.intensity = 10 + Math.sin(elapsedTime * 6) * 5


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()