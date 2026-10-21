document.querySelector("#load").addEventListener("click", async function () {
  const button = document.querySelector("#load");
  const status = document.querySelector("#status");
  status.textContent = "Loading…";
  status.dataset.state = "loading";
  button.disabled = true;
  try {
    const items = ["pen", "copy", "tea"];
    const replies = await Promise.all(items.map(function (item) {
      return fetch("/api/price?item=" + encodeURIComponent(item)).then(function (response) {
        if (!response.ok) throw new Error("Price unavailable");
        return response.json();
      });
    }));
    const prices = replies.map(function (reply) {
      const price = Number(reply.price);
      if (!Number.isFinite(price)) throw new Error("Invalid price");
      return price;
    });
    items.forEach(function (item, index) {
      document.getElementById(item).textContent = String(prices[index]);
    });
    document.querySelector("#loaded").textContent = String(prices.length);
    document.querySelector("#dearest").textContent = String(Math.max(...prices));
    document.querySelector("#sum").textContent = String(prices.reduce(function (total, price) {
      return total + price;
    }, 0));
    status.textContent = "The shelf is loaded.";
    status.dataset.state = "success";
  } catch (error) {
    ["pen", "copy", "tea"].forEach(function (item) {
      document.getElementById(item).textContent = "";
    });
    ["loaded", "dearest", "sum"].forEach(function (id) {
      document.getElementById(id).textContent = "0";
    });
    status.textContent = "The server is not answering.";
    status.dataset.state = "error";
  } finally {
    button.disabled = false;
  }
  });
