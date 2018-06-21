import { createStackNavigator } from "react-navigation";
import { MainScreen } from "./screens/main.screen";
import { ViewScreen } from "./screens/view.screen";

export default createStackNavigator({
  Main: MainScreen,
  View: ViewScreen
});
