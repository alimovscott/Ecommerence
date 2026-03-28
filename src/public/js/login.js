// login.js - Three.js 3D Background Animation

(function () {
    let scene, camera, renderer;
    let cubes = [];
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        const container = document.getElementById('canvas-container-login');

        // 1. Sahna
        scene = new THREE.Scene();
        // Orqa fonga mos tuman effekti
        scene.fog = new THREE.FogExp2(0x090a0f, 0.002); 

        // 2. Kamera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 500;

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Shaffof fon
        container.appendChild(renderer.domElement);

        // --- 3D Obyektlar (Suzib yuruvchi kublar) ---
        const geometry = new THREE.BoxGeometry(20, 20, 20); // Kichik kubiklar
        
        // Yaltiroq, shaffof material
        const material = new THREE.MeshPhongMaterial({
            color: 0x4facfe, // Ochiq ko'k
            shininess: 80,
            opacity: 0.7,
            transparent: true
        });

        // 200 ta kubik yaratamiz
        for (let i = 0; i < 200; i++) {
            const cube = new THREE.Mesh(geometry, material);
            
            // Tasodifiy joylashuv
            cube.position.x = Math.random() * 1000 - 500;
            cube.position.y = Math.random() * 1000 - 500;
            cube.position.z = Math.random() * 1000 - 500;
            
            // Tasodifiy aylanish
            cube.rotation.x = Math.random() * 2 * Math.PI;
            cube.rotation.y = Math.random() * 2 * Math.PI;
            
            // Tasodifiy o'lcham (bir xillikni buzish uchun)
            const scale = Math.random() * 1.5 + 0.5;
            cube.scale.set(scale, scale, scale);

            scene.add(cube);
            cubes.push(cube);
        }

        // --- Yoritish (Lighting) ---
        // Umumiy yorug'lik
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);

        // Asosiy yorug'lik manbai (ko'k/zangori)
        const directionalLight = new THREE.DirectionalLight(0x00f2fe, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
        
        // Qo'shimcha nuqtaviy yorug'lik (aks ettirish uchun)
        const pointLight = new THREE.PointLight(0x4facfe, 2, 600);
        pointLight.position.set(0, 300, 300);
        scene.add(pointLight);

        // Hodisalar
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onDocumentMouseMove);
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Parallax effekti uchun sichqoncha harakati
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Har bir kubikni sekin aylantiramiz
        for (let i = 0; i < cubes.length; i++) {
            cubes[i].rotation.x += 0.001;
            cubes[i].rotation.y += 0.002;
        }

        // Kamerani sichqoncha harakatiga qarab siljitamiz (Parallax)
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

})();