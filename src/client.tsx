window.addEventListener(`load`, function (e) {
    console.log(`Loaded`);

    const getElemById = document.getElementById.bind(document);
          getElemById(`body-waiting-message`).remove()
    const data = new Array(2).fill({
        title  : `Hello world!`,
        content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.`
        + `Ea similique quidem id ipsum ipsam veritatis eveniet ducimus cumque accusantium officiis,`
        + `mollitia quia autem sequi nostrum temporibus atque dolorum! Omnis, sint.`
    });
    const elts = data.map(function (entry) {
        const el1 = document.createElement(`h1`)
        const el2 = document.createElement(`p`)
              el1.textContent = entry.title;
              el2.textContent = entry.content;
        return [el1, el2]
    })
    elts.forEach(function ([el1, el2]) {
        document.body.appendChild(el1);
        document.body.appendChild(el2);
    })
})
