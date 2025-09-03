import { useState } from "react";
import axios from "axios";

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const detect = async () => {
    if (!image) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("image", image);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/ingredients/detect/", fd);
      setIngredients(res.data.ingredients);
    } catch (err) {
      console.error(err);
      alert("Failed to detect ingredients.");
    } finally {
      setLoading(false);
    }
  };

  const suggest = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/recipes/suggest/", { ingredients });
      setRecipes(res.data.results);
    } catch (err) {
      console.error(err);
      alert("Failed to suggest recipes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      minHeight: "100vh",
      color: "#fff",
      padding: "40px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#00fff7" }}>🍽 Ingredient → Recipe AI</h1>
        <p style={{ color: "#aaa", fontSize: "1rem" }}>Upload an image of ingredients and discover recipes instantly!</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="file" 
          onChange={e => setImage(e.target.files?.[0] || null)} 
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid #00fff7",
            background: "#1f1f2e",
            color: "#fff"
          }}
        />
        <button 
          onClick={detect} 
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#00fff7",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#00d0c7")}
          onMouseOut={e => (e.currentTarget.style.background = "#00fff7")}
        >
          Detect Ingredients
        </button>
        <button 
          onClick={suggest} 
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#ff6a00",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#ff8500")}
          onMouseOut={e => (e.currentTarget.style.background = "#ff6a00")}
        >
          Suggest Recipes
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ color: "#00fff7" }}>Ingredients:</h3>
        <p style={{ color: "#fff" }}>{ingredients.length > 0 ? ingredients.join(", ") : "No ingredients detected yet."}</p>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#fffa" }}>Loading...</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {recipes.map(r => (
          <div key={r.id} style={{
            background: "#1f1f2e",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 0 20px rgba(0,255,247,0.3)",
            transition: "0.3s",
          }}>
            <h3 style={{ color: "#00fff7" }}>{r.title}</h3>
            <p><strong>Coverage:</strong> {r.coverage}</p>
            <p><strong>Missing:</strong> {r.missing.length > 0 ? r.missing.join(", ") : "None"}</p>
            <p style={{ marginTop: "10px" }}>{r.steps}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
