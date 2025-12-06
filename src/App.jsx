import React, { useEffect } from "react";
import QuizContainer from "./components/QuizContainer";
import { applyUserThemeToDocument } from "./utils/applyUserThemeToDocument";

export default function App() {
  useEffect(() => {
    applyUserThemeToDocument({
      theme: "light",
      fontStyle: "default",
      fontSize: "medium",
      layoutWidth: "fullWidth",
      userThemeKey: "user-2", 
    });
  }, []);

  return (
    <div className="min-h-screen">
      <QuizContainer />
    </div>
  );
}
