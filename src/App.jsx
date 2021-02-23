import "./App.css";
import { useEffect, useState } from "react";

// C:\xampp\htdocs\ostoslista\
const URL = "http://localhost/ostoslista/";

function App() {
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    let status = 0;
    fetch(URL + "index.php")
      .then((response) => {
        status = parseInt(response.status);
        return response.json();
      })
      .then(
        (response) => {
          if (status === 200) {
            setItems(response);
          } else {
            alert(response.error);
          }
        },
        (error) => {
          alert(error);
        }
      );
  }, []);

  function save(e) {
    e.preventDefault();
    let status = 0;

    if (amount === "") {
      alert("Enter amount");
    } else if (desc.trim().length) {
      fetch(URL + "add.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          description: desc,
          amount: amount,
        }),
      })
        .then((res) => {
          status = parseInt(res.status);
          return res.json();
        })
        .then(
          (res) => {
            if (status === 200) {
              setItems((items) => [...items, res]);
              setDesc("");
              setAmount(1);
            } else {
              alert(res.error);
            }
          },
          (error) => {
            alert(error);
          }
        );
    } else {
      alert("Enter description");
    }
  }

  function remove(id) {
    let status = 0;
    fetch(URL + "delete.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          } else {
            alert(res.error);
          }
        },
        (error) => {
          alert(error);
        }
      );
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <div>
        <form onSubmit={save}>
          <label>New item </label>
          <input type="text" value={desc} placeholder="type description" onChange={(e) => setDesc(e.target.value)} />
          <input type="number" value={amount} placeholder="type amount" min="1" onChange={(e) => setAmount(e.target.value)} />
          <button>Add</button>
        </form>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.description}</span> <span>{item.amount}</span>{" "}
            <a href="/#" className="delete" onClick={() => remove(item.id)}>
              Delete
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
