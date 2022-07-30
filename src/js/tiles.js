const tileDataHandler = (link, description, added) => {
    const tileData = `
        <a class="mcp-tile__link" href="${link}" target="_blank" rel="noopener">

            <div class="mcp-tile__new-label">
                <span class="mcp-tile__new-label-text">New!</span>
            </div>

            <p class="mcp-tile__text">${description}</p>

            <p class="mcp-tile__date">Added: <time datetime="${added}">${added}</time></p>
        </a>
    `;
    return tileData;
};

const tileEventsHandler = (tile) => {
    tile.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            event.target.click();
        }
    });
};

const tileBlurHandler = (tile) => {
    const blurAfterClick = (event) => {
        if (event.target.classList.contains('mcp-tile__link')) {
            event.target.blur();
        } else {
            event.target.closest('.mcp-tile__link').blur();
        }
    };
    tile.addEventListener('click', () => blurAfterClick(event));
    tile.addEventListener('auxclick', () => blurAfterClick(event));
};

const createTile = (item, wrapper) => {
    const tile = document.createElement('li');
    tile.setAttribute(
        'class',
        `mcp-tile
        ${wrapper.classList.contains('mcp-tiles--latest') ? '' : ' mcp-tile--fade-out'}
        ${item.new ? ' mcp-tile--new' : ''}
    `
    );
    const tileData = tileDataHandler(item.link, item.description, item.added);
    tile.innerHTML = tileData;
    tileEventsHandler(tile);
    tileBlurHandler(tile);
    setTimeout(() => {
        tile.classList.remove('mcp-tile--fade-out');
    }, 50);
    return tile;
};

const generateLatestTiles = (database) => {
    const tilesWrapper = document.querySelector('.mcp-tiles--latest');
    const tiles = new DocumentFragment();
    database.forEach((item) => {
        if (item.new) {
            const tile = createTile(item, tilesWrapper);
            tiles.appendChild(tile);
        }
    });
    tilesWrapper.appendChild(tiles);
};

const btnsStateHandler = (event) => {
    const categoryBtns = document.querySelectorAll('.mcp-categories__item');
    categoryBtns.forEach((item) => {
        item.classList.add('mcp-categories__item--pending');
        setTimeout(() => {
            item.classList.remove('mcp-categories__item--pending');
        }, 800);
        if (item === event.target) {
            item.classList.add('mcp-categories__item--active');
            item.setAttribute('tabindex', '-1');
        }
        if (item !== event.target && item.classList.contains('mcp-categories__item--active')) {
            item.classList.remove('mcp-categories__item--active');
            item.setAttribute('tabindex', '0');
        }
    });
};

const removeCurrentTiles = (wrapper) => {
    const tilesWrapper = wrapper;
    const tiles = tilesWrapper.querySelectorAll('.mcp-tile');
    tiles.forEach((item) => {
        item.classList.add('mcp-tile--fade-out');
        setTimeout(() => {
            item.remove();
        }, 400);
    });
};

const generateNewTiles = (category, wrapper, database) => {
    const tilesWrapper = wrapper;
    const tiles = new DocumentFragment();
    database.forEach((item) => {
        if (item.category === category) {
            const tile = createTile(item, wrapper);
            tiles.appendChild(tile);
        }
    });
    tilesWrapper.appendChild(tiles);
};

const scrollTilesIntoView = () => {
    document.querySelector('.mcp-section--category').scrollIntoView();
};

const swapCategoryTiles = (event, category, database) => {
    const tilesWrapper = document.querySelector('.mcp-tiles--category');
    if (!event.target.classList.contains('mcp-categories__item--active')) {
        btnsStateHandler(event);
        removeCurrentTiles(tilesWrapper);
        setTimeout(() => generateNewTiles(category, tilesWrapper, database), 400);
        scrollTilesIntoView();
    }
};

const categoryBtnsHandler = (database) => {
    const btns = document.querySelectorAll('.mcp-categories__item');
    btns.forEach((item) => {
        const category = item.getAttribute('data-cat');
        item.addEventListener('click', (event) => {
            swapCategoryTiles(event, category, database);
        });
        item.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                event.preventDefault();
                swapCategoryTiles(event, category, database);
            }
        });
    });
};

const preventInitialScrollTilesIntoView = () => {
    window.scrollTo(0, 0);
};

const generateInitialTiles = () => {
    const categoryBtn = document.querySelector('.mcp-categories__item');
    categoryBtn.click();
    preventInitialScrollTilesIntoView();
};

const getDatabase = async () => {
    const response = await fetch('/src/js/database.json');
    if (response.status === 200) {
        const data = await response.json();
        return data.database;
    }
};

const initializeTiles = async () => {
    const database = await getDatabase();
    if (database) {
        generateLatestTiles(database);
        categoryBtnsHandler(database);
        generateInitialTiles();
    } else {
        alert("Couldn't load the database. Please reload the page.");
    }
};

window.addEventListener('load', initializeTiles);
