import { Route, Switch } from "wouter";
import Home from "./pages/home";
import Classes from "./pages/classes";
import Recipes from "./pages/recipes";
import Wellness from "./pages/wellness";
import MindShift from "./pages/mindshift";
import Book from "./pages/book";
import Reminders from "./pages/reminders";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/classes" component={Classes} />
        <Route path="/recipes" component={Recipes} />
        <Route path="/wellness" component={Wellness} />
        <Route path="/mindshift" component={MindShift} />
        <Route path="/book" component={Book} />
        <Route path="/reminders" component={Reminders} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
