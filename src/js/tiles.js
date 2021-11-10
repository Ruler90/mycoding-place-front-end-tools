const database = '';
console.log(db);

const tileDataHandler = (link, description, added) => {
    const tileData = `
        <a class="mcp-tile__link" href="${link}" target="_blank" rel="noopener">

            <div class="mcp-tile__new-label">
                <span class="mcp-tile__new-label-text">New!</span>
            </div>

            <p class="mcp-tile__text">${description}</p>

            <p class="mcp-tile__date">Added on ${added}</p>

        </a>
    `;
    return tileData;
}

const tileEventsHandler = (tile) => {
    tile.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            event.target.click();
        }
    })
}

const tileBlurHandler = (tile) => {

    const blurAfterClick = (event) => {
        if (event.target.classList.contains('mcp-tile__link')) {
            event.target.blur();
        } else {
            event.target.closest('.mcp-tile__link').blur();
        }
    } 
    tile.addEventListener('click', () => blurAfterClick(event))
    tile.addEventListener('auxclick', () => blurAfterClick(event))
}

const createTile = (item, wrapper) => {
    const tile = document.createElement('li');
    tile.setAttribute('class',
        `mcp-tile
        ${wrapper.classList.contains('mcp-tiles--latest') ? '' : ' mcp-tile--fade-out'}
        ${item.new ? ' mcp-tile--new' : ''}
    `);
    const tileData = tileDataHandler(item.link, item.description, item.added);
    tile.innerHTML = tileData;
    tileEventsHandler(tile);
    tileBlurHandler(tile);
    wrapper.appendChild(tile);
    setTimeout(() => {
        tile.classList.remove('mcp-tile--fade-out')
    }, 50)
}

const generateLatestTiles = () => {
    const tilesWrapper = document.querySelector('.mcp-tiles--latest');
    db.forEach(item => {
        if (item.new) {
            createTile(item, tilesWrapper);
        }
    })
}

const btnsStateHandler = (event) => {
    const categoryBtns = document.querySelectorAll('.mcp-categories__item');
    categoryBtns.forEach(item => {
        item.classList.add('mcp-categories__item--pending');
        setTimeout(() => {
            item.classList.remove('mcp-categories__item--pending');
        }, 800)
        if (item === event.target) {
            item.classList.add('mcp-categories__item--active');
            item.setAttribute('tabindex', '-1');
        }
        if (item !== event.target && item.classList.contains('mcp-categories__item--active')) {
            item.classList.remove('mcp-categories__item--active');
            item.setAttribute('tabindex', '0');
        }
    })
}

const removeCurrentTiles = (wrapper) => {
    const tilesWrapper = wrapper;
    const tiles = tilesWrapper.querySelectorAll('.mcp-tile');
    tiles.forEach(item => {
        item.classList.add('mcp-tile--fade-out');
        setTimeout(() => {
            item.remove();
        }, 400);
    })
}

const generateNewTiles = (category, wrapper) => {
    db.forEach(item => {
        if (item.category === category) {
            createTile(item, wrapper);
        }
    })
}

const scrollToTilesOnMobile = () => {
    if (window.innerWidth < 450) {
        document.querySelector('.mcp-section--category').scrollIntoView();
    }
}

const swapCategoryTiles = (event, category) => {
    const tilesWrapper = document.querySelector('.mcp-tiles--category');
    if (!event.target.classList.contains('mcp-categories__item--active')) {
        btnsStateHandler(event);
        removeCurrentTiles(tilesWrapper);
        setTimeout(() => {
            generateNewTiles(category, tilesWrapper);
        }, 400)
        scrollToTilesOnMobile()
    }
}

const categoryBtnsHandler = () => {
    const btns = document.querySelectorAll('.mcp-categories__item');
    btns.forEach(item => {
        const category = item.getAttribute('data-cat');
        item.addEventListener('click', (event) => {
            swapCategoryTiles(event, category);
        })
        item.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                event.preventDefault();
                swapCategoryTiles(event, category);
            }
        })
    })
}

const preventInitialScrollOnMobile = () => {
    if (window.innerWidth < 450) {
        window.scrollTo(0, 0);
    }
}

const generateInitialTiles = () => {
    const categoryBtn = document.querySelector('.mcp-categories__item');
    categoryBtn.click();
    preventInitialScrollOnMobile();
}

window.onload = () => {
    generateLatestTiles();
    categoryBtnsHandler();
    generateInitialTiles();
}