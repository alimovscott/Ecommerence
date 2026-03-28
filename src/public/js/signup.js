console.log("Signup frontend javascript file");

// --- QISM 1: FRONTEND LOGIKASI (jQuery) ---
$(function () {
    const fileInput = $(".member-image");
    const previewImage = $(".preview-image");
    const uploadZone = $(".glass-upload-zone");

    // Rasm tanlanganda prevyuni yangilash
    fileInput.on("change", function() {
        const file = this.files[0];
        const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

        if (file) {
            if (!validImageTypes.includes(file.type)) {
                alert("Please select a valid image format (JPG, JPEG, or PNG).");
                this.value = ''; // Inputni tozalash
                resetPreview();
            } else {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.attr("src", e.target.result);
                    uploadZone.addClass("has-image"); // Rasm borligini bildiruvchi klass
                }
                reader.readAsDataURL(file);
            }
        } else {
            resetPreview();
        }
    });

    function resetPreview() {
        previewImage.attr("src", "/img/default.jpeg");
        uploadZone.removeClass("has-image");
    }
});

// Formani validatsiya qilish
function validateSignupForm() {
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();
    const memberImage = $(".member-image").get(0).files.length;

    if(memberNick === "" || memberPhone === "" || memberPassword === "" || confirmPassword === "") {
        alert("Please fill in all required fields.");
        return false;
    }

    if(memberPassword !== confirmPassword) {
        alert("Passwords do not match. Please check again.");
        return false;
    }

    if(memberImage === 0) {
        alert("Please upload a restaurant image.");
        return false;
    }

    return true;
}


// --- QISM 2: THREE.JS 3D ORQA FON (Aylanma Zarrachalar - Torus Knot Particles) ---
(function () {
    let scene, camera, renderer;
    let particles;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        const container = document.getElementById('canvas-container-signup');

        scene = new THREE.Scene();
        // To'q binafsha/ko'k tuman
        scene.fog = new THREE.FogExp2(0x0f0c29, 0.002);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 600;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // --- Geometriya: Torus Knot (Murakkab tugun shakli) ---
        // (radius, tube radius, tubular segments, radial segments, p, q)
        const geometry = new THREE.TorusKnotGeometry(250, 60, 150, 20, 3, 5);
        
        // Shaklni zarrachalarga aylantiramiz
        const particlesGeometry = new THREE.PointsGeometry();
        // Vertikallar sonini oshiramiz (zichroq bo'lishi uchun)
        const vertices = [];
        const baseVertices = geometry.attributes.position.array;
        for (let i = 0; i < baseVertices.length; i += 3) {
             // Asl shakl atrofida biroz tarqoqlik (randomness) qo'shamiz
             const x = baseVertices[i] + (Math.random() - 0.5) * 30;
             const y = baseVertices[i+1] + (Math.random() - 0.5) * 30;
             const z = baseVertices[i+2] + (Math.random() - 0.5) * 30;
             vertices.push(x, y, z);
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));


        // Zarrachalar materiali
        const material = new THREE.PointsMaterial({
            color: 0x00f2fe, // Yorqin zangori
            size: 3,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true // Masofaga qarab o'lcham o'zgarishi
        });

        particles = new THREE.Points(particlesGeometry, material);
        scene.add(particles);

        // --- Yoritish ---
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x4facfe, 2, 800);
        pointLight1.position.set(300, 300, 300);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00f2fe, 2, 800);
        pointLight2.position.set(-300, -300, -300);
        scene.add(pointLight2);


        // Events
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

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Shaklni murakkab aylantirish
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.003;
        particles.rotation.z += 0.0005;

        // Parallax effekti
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
})();