import {
  CameraControls,
  Environment,
  Grid,
  RenderTexture,
  Text
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { slideAtom } from "./Overlay";
import { Scene } from "./Scene";

export const scenes = [
  {
    path: "models/mt6.glb",
    mainColor: "#ffffff",
    name: "Model T",
    description: "1908 - 1927",
    price: 72000,
    range: 660,
    spheres: [
      {
        id: 'model-t-tires',
        position: [5.2, 1.4, 1.4],
        cameraPos: [3, 1, -4],
        annotation: {
          position: [3.5, 1.5, -2.3],
          title: "Ford Fact",
          imageUrl: "https://www.mtfca.com/discus/messages/411944/477933.jpg",
          linkUrl: "https://www.mtfca.com/discus/messages/411944/477890.html",
          linkText: "Learn More",
          description: "Firestone was the first company to produce tires for the Model T, and they were the only company to do so for the first two years of production. The tires were made of solid rubber, and were 30x3 inches in size. The tires were later replaced with pneumatic tires, which were more comfortable and durable.",
          rotation: [0, - Math.PI * 1, 0]
        }
      },
      {
        id: 'model-t-glass',
        position: [3.7, 1, 3.3],
        cameraPos: [2, 3, 4],
        annotation: {
          position: [3, 1.4, 2.8],
          title: "Check out our drinkware collection",
          imageUrl: "https://fordsgaragegear.com/cdn/shop/files/drinkware-cat-bg-w-30overlay-rev1_1270x.jpg?v=1681879179",
          linkUrl: "https://fordsgaragegear.com/collections/drinkware",
          linkText: "shop now",
          description: "Get your very own Ford's Garage drinkware, including koozies, glasses, and more.",
          rotation: [ Math.PI / 1.5, - Math.PI / 1, Math.PI / 1.2]
        }
      },
      {
        id: 'model-t-motorclub',
        position: [-4., 1.2, 3],
        cameraPos: [-7, 1, 4],
        annotation: {
          position: [-3.4, 1.7, 4.8],
          title: "Join the Ford's Motor Club",
          imageUrl: "https://fordsgarageusa.com/wp-content/uploads/2023/05/motorclub.png.webp",
          linkUrl: "https://fordsgarageusa.com/motorclub/",
          linkText: "Join today",
          description: "Looking for some extra perks at Ford's Garage? Join our Motor Club to get exclusive deals, discounts, and more.",
          rotation: [0, Math.PI * 1.5, 0]
        }
      },
      {
        id: 'model-t-fireplace',
        position: [-4.4, 1, -2.3],
        cameraPos: [-2, 2, -3],
        annotation: {
          position: [-3, 1.5, -2],
          title: "FORD Fact:",
          imageUrl: "https://credo.library.umass.edu/images/resize/1080/muph061-sl141-i001-001.jpg",
          linkUrl: "https://www.thehenryford.org/collections-and-research/digital-collections/artifact/139098",
          linkText: "Learn More",
          description: "Henry Ford, Thomas Edison, and Harvey Firestone took a visit to President Calvin Coolidge's Farm in 1924. These iconic photos were taken during a period where all four men were close friends, and regularly took trips together. The Ford's Garage fireplace is a replica of the one found in the Coolidge Farm.",
          rotation: [1/2, Math.PI / 1.2, -1/3]
        }
      }
    ]
  },
  {
    path: "models/ma2.glb",
    mainColor: "#ffffff",
    name: "Model A",
    description: "1927 - 1931",
    price: 500,
    range: 30,
    spheres: [
      {
        id: 'model-a-photo',
        position: [4, .8, -1.8],
        cameraPos: [4, 1, -4],
        annotation: {
          position: [5.1, 1, -2],
          title: "Ford fact:",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ford1903.jpg/640px-Ford1903.jpg",
          linkUrl: "https://www.thehenryford.org/collections-and-research/digital-collections/artifact/48168/#slide=gs-214129",
          linkText: "Learn More",
          description: "The original Model A was the first car ever produced by Ford Motor Company, starting in 1903. The car started at around 800$ during the time of it's production, and was recently sold at an auction in 2023 for $173,600.",
          rotation: [0, - Math.PI / 1.1, 0]
        }
      },
      {
        id: 'model-a-burger',
        position: [4.2, .9, 3],
        cameraPos: [2, 1, 1],
        annotation: {
          position: [3.1, .5, 3],
          title: "FORD FACT:",
          imageUrl: "https://www.srqmagazine.com/_images/images/srqdaily/content/20230918145119264.jpg",
          linkUrl: "https://fordsgarageusa.com/find-restaurant/",
          linkText: "View Locations",
          description: "The Model A is one of our signature burgers we carry at Ford's Garage. Check out our menu to see other iconic burgers we have to offer.",
          rotation: [ Math.PI / 2, - Math.PI, - Math.PI /5]
        }
      },
      {
        id: 'model-a-clothes',
        position: [-4.5, 1.5, 2.5],
        cameraPos: [-5, 1, 6],
        annotation: {
          position: [-5.7, 1.7, 3.5],
          title: "Bundle up with ford's gear!",
          imageUrl: "https://fordsgaragegear.com/cdn/shop/files/ford_s_thick_hoodie_360x.jpg?v=1684197375",
          linkUrl: "https://fordsgaragegear.com/",
          linkText: "Visit our store",
          description: "Find custom Ford's winter-wear and other merchandise at our online store.",
          rotation: [0, Math.PI / 12, 0]
        }
      },
      {
        id: 'model-a-flag',
        position: [-4.2, 3.5, -.8],
        cameraPos: [-1, 2, 1],
        annotation: {
          position: [-4, 4, 1],
          title: "Fun Fact:",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Star_Spangled_Banner_%28Carr%29_%281814%29.png",
          linkUrl: "https://www.mdhistory.org/resources/the-star-spangled-banner/",
          linkText: "Learn More",
          description: "The Star Spangled Banner was named the national anthem of the United States of America in 1931, near the end of the Model A's production life. The current version of the flag only had 48 stars at the time, due to Alaska and Hawaii not being considered states yet.",
          rotation: [0, Math.PI / 3.5, 0]
        }
      },
      {
        id: 'model-a-gas',
        position: [-3.5, 1.4, -4],
        cameraPos: [-4, 2, -8],
        annotation: {
          position: [-4.5, 1.6, -5],
          title: "Fun Fact:",
          imageUrl: "https://render.fineartamerica.com/images/rendered/default/print/6/8/break/images-medium-5/gas-pump-patent-drawing-from-1930-vintage-aged-pixel.jpg",
          linkUrl: "https://fordsgarageusa.com/find-restaurant/",
          linkText: "Find Locations",
          description: "Gas pumps with a visible glass cylinder were first introduced in 1930, allowing customers to see the fuel they were purchasing. At Ford's Garage, we have replica models of the original 1930 gas pump on display. See them for yourself!",
          rotation: [0,  Math.PI / 1.1, 0]
        }
      }
    ]
  },
  {
    path: "models/mb5.glb",
    mainColor: "#ffffff",
    name: "Model B",
    description: "1932 - 1934",
    price: 150000,
    range: 800,
    spheres: [
      {
        id: 'model-b-presents',
        position: [5, .8, -3],
        cameraPos: [3, 1, -4],
        annotation: {
          position: [5.6, 1, -3.8],
          title: "enjoy your free gift on us",
          imageUrl: "https://fordsgarageusa.cardfoundry.com/merch/fordsgarageusa/images/giftcard_images/card_fordsgarageCRD.png",
          linkUrl: "https://www.thehenryford.org/collections-and-research/digital-collections/artifact/48168/#slide=gs-214129",
          linkText: "Gift Card Store",
          description: "After purchasing a 50$ gift card, you will receive a free 10$ gift card to use at Ford's Garage. This offer is only available for a limited time, so make sure to get yours today!",
          rotation: [0, - Math.PI / 2, 0]
        }
      },
      {
        id: 'model-b-pic',
        position: [5, 1.5, 2.4],
        cameraPos: [2, 3, 4],
        annotation: {
          position: [4, 2.4, 4],
          title: "FORD FACT:",
          imageUrl: "https://performance.ford.com/content/fordracing/home/enthusiasts/newsroom/2018/03/mose-nowland-tells-the-history-of-the-flathead/_jcr_content/fr-contentItem/image.img.jpg/1600176159996.jpg",
          linkUrl: "https://www.hotrod.com/how-to/flathead-ford-engine-guide/",
          linkText: "Learn More",
          description: "The Ford flathead V8 was the first mass-produced V8 engine, and was used in many Ford vehicles starting in 1932. The engine was used in many Ford vehicles, including the Model B, and was produced until 1953. You can actually find some flathead V8 engines on display in Ford's Garage.",
          rotation: [ Math.PI / 2, - Math.PI / 2, Math.PI / 2]
        }
      },
      {
        id: 'model-b-hats',
        position: [-4.5, 1.8, 2],
        cameraPos: [-5, 1, 4],
        annotation: {
          position: [-5.4, 1.9, 1.7],
          title: "Cap up this season with Ford's gear",
          imageUrl: "https://fordsgaragegear.com/cdn/shop/products/33_v8_black_940x.jpg?v=1675999076",
          linkUrl: "https://fordsgaragegear.com/collections/headwear",
          linkText: "Learn More",
          description: "Find custom Ford's Garage hats and other merchandise at our online store.",
          rotation: [0, Math.PI / 12, 0]
        }
      },
      {
        id: 'model-b-beer-kegs',
        position: [-4.4, 1, -2.85],
        cameraPos: [-1, 2, 1],
        annotation: {
          position: [-4, 3.4, .5],
          title: "Fun Fact:",
          imageUrl: "https://i.etsystatic.com/10024556/r/il/3fb789/2385956804/il_fullxfull.2385956804_mme4.jpg",
          linkUrl: "https://www.mdhistory.org/resources/the-star-spangled-banner/",
          linkText: "View our draft list",
          description: "Prohibition was finally ending during the production of the Model B, when cash-strapped governments were looking for new sources of revenue. The 21st Amendment was ratified in 1933, ending the era of prohibition. \n Luckily, you can still enjoy a cold one at Ford's Garage today! Check out some of our local brews, as well as the classics.",
          rotation: [0, Math.PI / 5, 0]
        }
      },
    ]
  }
];

const CameraHandler = ({ slideDistance }) => {
  const viewport = useThree((state) => state.viewport);
  const cameraControls = useRef();
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const { dollyDistance } = useControls({
    dollyDistance: {
      value: 20,
      min: 0,
      max: 50,
    },
  });

  const moveToSlide = async () => {
    await cameraControls.current.setLookAt(
      lastSlide.current * (viewport.width + slideDistance),
      3,
      dollyDistance,
      lastSlide.current * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    await cameraControls.current.setLookAt(
      (slide + 1) * (viewport.width + slideDistance),
      1,
      dollyDistance,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );

    await cameraControls.current.setLookAt(
      slide * (viewport.width + slideDistance),
      0,
      5,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  useEffect(() => {
    // Used to reset the camera position when the viewport changes
    const resetTimeout = setTimeout(() => {
      cameraControls.current.setLookAt(
        slide * (viewport.width + slideDistance),
        0,
        5,
        slide * (viewport.width + slideDistance),
        0,
        0
      );
    }, 200);
    return () => clearTimeout(resetTimeout);
  }, [viewport]);

  useEffect(() => {
    if (lastSlide.current === slide) {
      return;
    }
    moveToSlide();
    lastSlide.current = slide;
  }, [slide]);
  return (
    <CameraControls
      ref={cameraControls}
      touches={{
        one: 0,
        two: 0,
        three: 0,
      }}
      mouseButtons={{
        left: 0,
        middle: 0,
        right: 0,
      }}
    />
  );
};

export const Experience = () => {
  const viewport = useThree((state) => state.viewport);
  const [slide] = useAtom(slideAtom);
  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment preset={"city"} />
      <CameraHandler slideDistance={slideDistance} />
      
      {/* MAIN TEXT MESHES */}
      <group>
        <Text
          position={[0, viewport.height / 2 + 1.5, 0]}
          scale={1}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="src\fonts\ProhibitionTest-Regular.otf"
          fontSize={1}
        >
          1908
        </Text>

        <Text
          position={[viewport.width + slideDistance, viewport.height / 2 + 1.5, 0]}
          scale={1}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="src\fonts\ProhibitionTest-Regular.otf"
          fontSize={1}
        >
          1927
        </Text>

        <Text
          position={[2 * (viewport.width + slideDistance), viewport.height / 2 + 1.5, 0]}
          scale={1}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="src\fonts\ProhibitionTest-Regular.otf"
          fontSize={1}
        >
          1932
        </Text>
      </group>

      <Grid
        position-y={-viewport.height / 2}
        sectionSize={1}
        sectionColor={"black"}
        sectionThickness={1}
        cellSize={0.5}
        cellColor={"#6f6f6f"}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
      />
      {scenes.map((scene, index) => (
        <mesh
          key={index}
          position={[index * (viewport.width + slideDistance), 0, 0]}
        >
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial toneMapped={false}>
            <RenderTexture attach="map">
              <Scene {...scene} isActive={index === slide} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};