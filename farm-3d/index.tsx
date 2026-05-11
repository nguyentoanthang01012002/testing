"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Environment } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import Link from 'next/link';

// --- KHO CHỨA LINK TÀI NGUYÊN (ASSETS) ---
const ASSETS = {
  trees: [
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499579/Obj_Cross_1_Tree_4_el3b3f.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499573/Obj_Cross_1_Tree_3_sc8erc.obj"
  ],
  rocks: [
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499579/Cross_Zone1_9_Rock01_gxeuc5.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499579/Ice_Zone1_1p_Rock01_50738_agelmo.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499575/Grass_Zone1_3I_Rock_pry9hq.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499575/Event_Concert_Zone1_21_Rock10_lmtzak.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499574/Cross_Zone1_8_Rock05_uuvhra.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499569/Cross_Zone1_14_Rock02_xfdcs7.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499569/Event_Concert_Zone1_21_Rock04_epieyn.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499567/Dessert_Zone1_1G_Rock_vpz7cc.obj"
  ],
  houses: [
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499563/Build_Event_Concert_FireflyHouse_OBJ09_hnevco.obj",
    "https://res.cloudinary.com/dz7kolmlf/raw/upload/v1778499563/Deco_Event_Bamboo_HouseD_Jar05_d8cpsp.obj"
  ]
};

// --- HÀM TRIỆU HỒI VẬT THỂ 3D ---
function IslandObject({ objUrl, textureUrl = null, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], fallbackColor = "white" }) {
  // Tải file .obj
  const obj = useLoader(OBJLoader, objUrl);
  
  // Tải file ảnh .png (nếu có)
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  // Clone object để dùng được nhiều lần (nhiều cây, nhiều đá)
  const copiedScene = useMemo(() => obj.clone(), [obj]);

  // Đắp da thịt (Texture) hoặc tô màu tạm (Fallback Color)
  React.useEffect(() => {
    copiedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (texture) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        } else {
          child.material = new THREE.MeshStandardMaterial({ color: fallbackColor, roughness: 0.8 });
        }
      }
    });
  }, [copiedScene, texture, fallbackColor]);

  return <primitive object={copiedScene} position={position} scale={scale} rotation={rotation} />;
}

// --- GIAO DIỆN CHÍNH NÔNG TRẠI 3D ---
export default function Farm3D() {
  return (
    <div className="w-full h-screen bg-cyan-50 relative overflow-hidden">
      
      {/* KHUNG CẢNH 3D */}
      <Canvas camera={{ position: [15, 10, 15], fov: 45 }}>
        {/* Ánh sáng & Bầu trời */}
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        
        <Suspense fallback={null}>
          
          {/* NỀN ĐẤT TẠM THỜI (Vì chưa có model đảo) */}
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[15, 15, 1, 32]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[14.5, 14.5, 1.01, 32]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>

          {/* NHÀ CỬA */}
          <IslandObject 
            objUrl={ASSETS.houses[0]} 
            position={[0, 0.5, -2]} 
            scale={0.02} // Bác chỉnh scale cho vừa với model thật nhé
            fallbackColor="#fca5a5" 
          />
          <IslandObject 
            objUrl={ASSETS.houses[1]} 
            position={[-4, 0.5, -5]} 
            scale={0.02} 
            fallbackColor="#fcd34d" 
          />

          {/* RỪNG CÂY */}
          <IslandObject objUrl={ASSETS.trees[0]} position={[5, 0.5, -5]} scale={0.03} fallbackColor="#22c55e" />
          <IslandObject objUrl={ASSETS.trees[1]} position={[7, 0.5, -2]} scale={0.03} fallbackColor="#16a34a" />
          <IslandObject objUrl={ASSETS.trees[0]} position={[-7, 0.5, 2]} scale={0.03} fallbackColor="#15803d" />
          
          {/* ĐÁ TẢNG XUNG QUANH */}
          <IslandObject objUrl={ASSETS.rocks[0]} position={[8, 0.5, 5]} scale={0.04} fallbackColor="#9ca3af" />
          <IslandObject objUrl={ASSETS.rocks[1]} position={[-8, 0.5, -3]} scale={0.04} fallbackColor="#6b7280" />
          <IslandObject objUrl={ASSETS.rocks[2]} position={[3, 0.5, 8]} scale={0.04} fallbackColor="#4b5563" />
          <IslandObject objUrl={ASSETS.rocks[3]} position={[-3, 0.5, 7]} scale={0.04} fallbackColor="#9ca3af" />

          {/* Môi trường & Bóng đổ */}
          <Environment preset="forest" />
          <ContactShadows opacity={0.5} scale={30} blur={2} far={10} />
        </Suspense>

        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={30} />
      </Canvas>
      
      {/* UI GIAO DIỆN ĐÈ LÊN 3D */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <button className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl font-black text-amber-950 border-b-[4px] border-amber-200 active:border-b-0 active:translate-y-[4px] shadow-lg hover:bg-amber-50 transition-all flex items-center gap-2">
            <span className="text-2xl">🚜</span> Quay lại Nông Trại
          </button>
        </Link>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-4 border-amber-200 text-right">
          <h3 className="font-black text-amber-950 uppercase">Đảo Mèo 3D</h3>
          <p className="text-sm font-bold text-gray-500">Kéo chuột để xoay camera</p>
          <p className="text-sm font-bold text-gray-500">Lăn chuột để phóng to/thu nhỏ</p>
        </div>
      </div>

      {/* LỚP LOADING (Hiển thị khi đang tải 3D) */}
      <div id="loader" className="absolute inset-0 bg-cyan-100 flex flex-col items-center justify-center z-0 pointer-events-none transition-opacity duration-1000">
         <div className="text-6xl animate-bounce mb-4">🏝️</div>
         <h2 className="font-black text-2xl text-cyan-900 uppercase tracking-widest">Đang triệu hồi hòn đảo...</h2>
      </div>
    </div>
  );
}