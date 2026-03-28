// Three.js yordamida zamonaviy 3D sahna yaratish
(function () {
    let scene, camera, renderer;
    let sphereMesh, particlesMesh;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        const container = document.getElementById('canvas-container');

        // 1. Sahna (Scene) yaratish
        scene = new THREE.Scene();
        // Tuman effekti (sahna chuqurligi uchun)
        scene.fog = new THREE.FogExp2(0x0f3460, 0.001);

        // 2. Kamera (Camera) sozlash
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 600;

        // 3. Renderer sozlash
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Orqa fon rangini CSS ga moslashtiramiz (yoki shaffof qilamiz)
        renderer.setClearColor(0x000000, 0); 
        container.appendChild(renderer.domElement);

        // --- 3D OBYEKTLAR ---

        // A) Asosiy geometrik shakl (Simli Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(200, 1); // Murakkabroq shar shakli
        const material = new THREE.MeshPhongMaterial({
            color: 0xe3c08d, // Oltin/jigarrang rang (sizning menyuingizga mos)
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        sphereMesh = new THREE.Mesh(geometry, material);
        scene.add(sphereMesh);

        // B) Zarrachalar (Particles) tizimi
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000; // Zarrachalar soni
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            // Zarrachalarni tasodifiy joylashtirish
            posArray[i] = (Math.random() - 0.5) * 2000; 
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 2,
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- YORITISH ---
        const ambientLight = new THREE.AmbientLight(0x404040); // Yumshoq umumiy yorug'lik
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xe3c08d, 2, 1000);
        pointLight1.position.set(200, 200, 200);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x0f3460, 3, 1000);
        pointLight2.position.set(-200, -200, -200);
        scene.add(pointLight2);


        // Hodisalar (Events)
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onDocumentMouseMove);
    }

    // Oyna o'lchami o'zgarganda moslashtirish
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Sichqoncha harakatini kuzatish (Parallax effekti uchun)
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.2;
        mouseY = (event.clientY - windowHalfY) * 0.2;
    }

    // Animatsiya tsikli
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Obyektlarni avtomatik aylantirish
        sphereMesh.rotation.x += 0.001;
        sphereMesh.rotation.y += 0.002;
        particlesMesh.rotation.y += 0.0005;

        // Sichqoncha harakatiga qarab kamerani biroz siljitish (Parallax)
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

})();