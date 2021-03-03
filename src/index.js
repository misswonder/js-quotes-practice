const BASEURL = "http://localhost:3000/quotes";

function getQuotes() {
  fetch(BASEURL + "?_embed=likes")
    .then((res) => res.json())
    .then((quoteData) => quoteData.forEach(renderQuotes));
}

getQuotes();

function renderQuotes(quote) {
  let list = document.querySelector(`#quote-list > li[data-id="${quote.id}"]`);

  if (list) {
    list.innerHTML = "";
  } else {
    list = document.createElement("li");
    list.dataset.id = quote.id;
    list.className = "quote-card";
    document.getElementById("quote-list").appendChild(list);
  }

  let blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  let p = document.createElement("p");
  p.className = "mb-0";
  p.innerText = quote.quote;

  let footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;

  let br = document.createElement("br");

  let likeBtn = document.createElement("button");
  likeBtn.className = "btn-success";
  likeBtn.innerText = "Likes:";
  likeBtn.dataset.id = quote.id;
  likeBtn.addEventListener("click", likeQuote);

  let span = document.createElement("span");
  span.innerText = quote.likes?.length ?? 0;

  let delBtn = document.createElement("button");
  delBtn.className = "btn-danger";
  delBtn.innerText = "Delete";
  delBtn.addEventListener("click", () => {
    delQuote(quote, list);
  });

  likeBtn.appendChild(span);
  list.append(blockquote, p, footer, br, likeBtn, delBtn);
}

document
  .getElementById("new-quote-form")
  .addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  console.log(event);

  let newQuote = event.target.quote.value;
  let newAuthor = event.target.author.value;

  let newQuoteObj = {
    quote: newQuote,
    author: newAuthor,
  };

  let reqObj = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(newQuoteObj),
  };

  fetch(BASEURL, reqObj)
    .then((res) => res.json())
    .then(renderQuotes);
}

function likeQuote(event) {
  const quoteId = parseInt(event.target.dataset.id);
  let newLike = {
    quoteId,
  };

  fetch("http://localhost:3000/likes", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newLike),
  }).then(() => {
    fetch(BASEURL + "/" + quoteId + "?_embed=likes")
      .then((res) => res.json())
      .then((quote) => renderQuotes(quote));
  });
}

function delQuote(quote, list) {
  fetch(BASEURL + "/" + quote.id, { method: "DELETE" }).then(() =>
    list.remove()
  );
}
