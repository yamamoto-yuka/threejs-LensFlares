import * as THREE from "./build/three.module.js";
import { FlyControls } from "./jsm/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "./jsm/objects/Lensflare.js";

let camera, scene, renderer;
let controls;

// 現在の経過時間を出力
const clock = new THREE.Clock();

init();

function init() {
  // camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1, //開始距離
    15000 //終了距離
  );
  camera.position.z = 250;

  // scene
  scene = new THREE.Scene();

  // geometry = object
  const size = 250;
  // BoxGeometry(size, size, size); 直方体
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff, //16進数
    specular: 0xfffff, //共鳴反射、反射を示す
    shininess: 50, //輝度、輝く度合い
  });

  // メッシュは、ランダムにボックスを2500個作成した後に行う
  // まずメッシュを2500こ作成する
  for (let i = 0; i < 2500; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    // メッシュの位置を決める
    // 0-1を小数点ありの、0-1をランダムに出力する
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    // 1つ1つのオブジェクトの回転どあいをランダムに決める
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    scene.add(mesh);
  }

  // 平行光源
  const dirLight = new THREE.DirectionalLight(0xfffffff, 0.03);
  scene.add(dirLight);


  // レンズフレアの追加をする
  const textureLoader = new THREE.TextureLoader();
  const textureFlare = textureLoader.load("./textures/LensFlare.png");
  const lensflare = new Lensflare();

  addLight(0.08, 0.3, 0.9, 0, 0, -1000);

  // ポイント光源を追加する
  // addLight(hue色相, saturationsa明るさ, light輝度, x, y, z)
  function addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000);
    // setHSL()　色相、彩度、輝度を設定する
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    lensflare.addElement(
      new LensflareElement(textureFlare, 700, 0, light.color)
    )
  
    scene.add(lensflare);
  }
   

  // レンダーする
  renderer = new THREE.WebGL1Renderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 明るくなる
  renderer.outputEncoding = THREE.sRGBEncoding;
  // bodyタグの中にレンダリングする
  document.body.appendChild(renderer.domElement);

  // マウス操作を行う
  // カメラを動かし、レンダーを動かす
  controls = new FlyControls(camera, renderer.domElement);
  // コントロールのスピードの変数を変える、マウスでの動きを早くする
  // 左と右クリックの移動速度を変更できる
  controls.movementSpeed =  2500;
  // カーソルの位置で移動速度を変更できる
  controls.rollSpeed = Math.PI /20;
  animate();

  // リサイズしたら自動でウィンドウをリサイズする
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}


function animate(){
  // フレームタインで画像を更新
  requestAnimationFrame(animate);
  // 経過した時間を
  render();
}

function render(){
  const delta = clock.getDelta(); //経過時間を取得

  controls.update(delta); //マウス移動とかがこれで使えるようになる
  renderer.render(scene, camera);
}