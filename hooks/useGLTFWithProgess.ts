// //※うまく動かないので、一旦コメントアウト

// import { useEffect, useState } from 'react';
// import { useSetRecoilState } from 'recoil';
// import * as THREE from 'three';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// import { loadProgressAtom } from '@/store/loadProgressAtom';

// type GLTFResult = GLTF & {
//   nodes: {
//     body: THREE.SkinnedMesh;
//     bottoms: THREE.SkinnedMesh;
//     cap: THREE.SkinnedMesh;
//     comtac: THREE.SkinnedMesh;
//     comtac_yeahpad: THREE.SkinnedMesh;
//     glass: THREE.SkinnedMesh;
//     goggle_belt: THREE.SkinnedMesh;
//     goggle_frame: THREE.SkinnedMesh;
//     Head_1: THREE.SkinnedMesh;
//     shoes: THREE.SkinnedMesh;
//     tops: THREE.SkinnedMesh;
//     suitcase: THREE.Mesh;
//     Root: THREE.Bone;
//   };
//   materials: object;
//   animations: GLTFAction[];
// };

// type ActionName = 'ArmatureAction';

// interface GLTFAction extends THREE.AnimationClip {
//   name: ActionName;
// }

// interface UseGLTFWithProgressProps {
//   url: string;
//   useDraco?: boolean;
// }

// interface ExtendedGLTF extends GLTF {
//   nodes: { [key: string]: THREE.Mesh | THREE.SkinnedMesh };
//   materials: { [key: string]: THREE.Material };
//   animations: THREE.AnimationClip[];
// }

// export const useGLTFWithProgress = ({ url, useDraco = true }: UseGLTFWithProgressProps) => {
//   const [gltf, setGltf] = useState<ExtendedGLTF | null>(null);
//   const setProgress = useSetRecoilState(loadProgressAtom);

//   useEffect(() => {
//     const loader = new GLTFLoader();

//     if (useDraco) {
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('/draco/');
//       loader.setDRACOLoader(dracoLoader);
//     }

//     loader.load(
//       url,
//       (gltf) => setGltf(gltf as ExtendedGLTF),
//       (event) =>
//         setProgress((prev) => {
//           return {
//             ...prev,
//             modelProgress: event.loaded,
//             modelTotal: event.total,
//           };
//         }),
//       (error) => console.error(error)
//     );
//   }, [url, useDraco, setProgress]);

//   if (!gltf) return null;

//   return {
//     nodes: gltf.nodes as unknown as GLTFResult['nodes'],
//     materials: gltf.materials as GLTFResult['materials'],
//     animations: gltf.animations as GLTFResult['animations'],
//   };
// };
