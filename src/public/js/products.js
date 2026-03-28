console.log("Products frontend javascript file");

// --- QISM 1: FRONTEND FUNKSIONALLIGI (jQuery & Axios) ---
$(function() {
    // Formani ko'rsatish/yashirish
    $("#process-btn").on("click", () => {
        $(".glass-form-container").slideDown(500); // slideToggle o'rniga slideDown aniqroq
        $("#process-btn").fadeOut(300);
    });

    $("#cancel-btn").on("click", () => {
        $(".glass-form-container").slideUp(300);
        $("#process-btn").fadeIn(300);
    });

    // Maxsulot holatini (Status) o'zgartirish
    $(".new-product-status").on("change", async function(e) {
       const id = e.target.id;
       const productStatus = $(`#${id}.new-product-status`).val();

       try{
        // Select elementini vaqtincha o'chirib turamiz (loading effekti uchun)
        $(this).prop('disabled', true).css('opacity', '0.5');
        
        const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
        const result = response.data;

        if(result.data) {
            console.log("Product updated successfully");
            // Muvaffaqiyatli bo'lsa, vizual tasdiq (masalan, yashil rang) berish mumkin
            $(this).css('border-color', '#28a745');
            setTimeout(() => { $(this).css('border-color', ''); }, 1000);
        } else {
            alert("Product update failed!");
            // Xatolik bo'lsa, eski holatiga qaytarish kerak bo'lishi mumkin
        }
       } catch(err) {
        console.log( err );
        alert("Product update failed due to network error.");
       } finally {
           // Selectni qayta yoqamiz
           $(this).prop('disabled', false).css('opacity', '1');
           $(this).blur();
       }
    });    
});

// Formani validatsiya qilish
function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    
    if(productName === "" || productPrice === "" || productLeftCount === "" || productCollection === "" || productDesc === "") {
        alert("Please fill in all required fields!");
        return false;
    }
    // Birinchi rasm yuklanganligini tekshirish
    if($(".image-one").get(0).files.length === 0) {
         alert("Please upload at least the first image!");
         return false;
    }
    return true;
}

// Rasm prevyusi (Preview)
function priviewFileHandler(input, order) {
    const file = input.files[0];
    const validImageType = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if(file && !validImageType.includes(file['type'])) {
      alert("Please upload only JPG, JPEG, PNG, or WEBP images.");
      input.value = ''; // Inputni tozalash
      $(`#image-section-${order}`).attr("src", "/img/upload.svg"); // Prevyuni qaytarish
    } else if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            $(`#image-section-${order}`).attr("src", reader.result).css('opacity', '1');
        };
        reader.readAsDataURL(file);
    }
}


// --- QISM 2: THREE.JS 3D ORQA FON ---
(function () {
    let scene, camera, renderer;
    let mesh;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        const container = document.getElementById('canvas-container-products');

        scene = new THREE.Scene();
        // To'q rangli tuman
        scene.fog = new THREE.FogExp2(0x0f0c29, 0.0015);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 1000;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // --- Geometriya: Bog'langan To'r (Lattice Structure) ---
        // IcosahedronGeometry - murakkabroq geometrik shakl
        const geometry = new THREE.IcosahedronGeometry(600, 2); 
        
        const material = new THREE.MeshPhongMaterial({
            color: 0xe3c08d, // Asosiy rang (oltin)
            wireframe: true, // Faqat qirralarini ko'rsatish
            transparent: true,
            opacity: 0.15, // Juda shaffof
            shininess: 50
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- Yoritish ---
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0x4facfe, 0.5); // Moviy yorug'lik
        directionalLight2.position.set(-1, -1, -1);
        scene.add(directionalLight2);

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
        mouseX = (event.clientX - windowHalfX) * 0.1;
        mouseY = (event.clientY - windowHalfY) * 0.1;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Sekin aylanish
        mesh.rotation.x += 0.0005;
        mesh.rotation.y += 0.001;

        // Parallax effekti
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
})();