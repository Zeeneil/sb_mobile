import { imageSrc } from "../Icons/icons";
import { View, Image } from "react-native";

const Characters = () => (
  <>
    <Image
      source={imageSrc.bookgirl}
      style={{
        width: 150, 
        height: 150, 
        resizeMode: 'contain', 
        position: 'absolute',
        bottom: 0,
        left: 0,
      }}
    />
    <Image
      source={imageSrc.colorboy}
      style={{ 
        width: 150, 
        height: 150, 
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}
    />
  </>
);

export default Characters;