const tileDataHandler = (link, description, added) => {
    const tileData = `
        <a class="fet-tile__link" href="${link}" target="_blank" rel="noopener">

            <div class="fet-tile__new-label">
                <span class="fet-tile__new-label-text">New!</span>
            </div>

            <p class="fet-tile__text">${description}</p>

            <p class="fet-tile__date">Added on ${added}</p>

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

const createTile = (item, wrapper) => {
    const tile = document.createElement('li');
    tile.setAttribute('class',
        `fet-tile
        ${wrapper.classList.contains('fet-tiles--latest') ? '' : ' fet-tile--fade-out'}
        ${item.new ? ' fet-tile--new' : ''}
    `);
    const tileData = tileDataHandler(item.link, item.description, item.added);
    tile.innerHTML = tileData;
    tileEventsHandler(tile);
    wrapper.appendChild(tile);
    setTimeout(() => {
        tile.classList.remove('fet-tile--fade-out')
    }, 50)
}

const generateLatestTiles = () => {
    const tilesWrapper = document.querySelector('.fet-tiles--latest');
    db.forEach(item => {
        if (item.new) {
            createTile(item, tilesWrapper);
        }
    })
}

const btnsStateHandler = (event) => {
    const categoryBtns = document.querySelectorAll('.fet-categories__item');
    categoryBtns.forEach(item => {
        item.classList.add('fet-categories__item--pending');
        setTimeout(() => {
            item.classList.remove('fet-categories__item--pending');
        }, 800)
        if (item === event.target) {
            item.classList.add('fet-categories__item--active');
            item.setAttribute('tabindex', '-1');
        }
        if (item !== event.target && item.classList.contains('fet-categories__item--active')) {
            item.classList.remove('fet-categories__item--active');
            item.setAttribute('tabindex', '0');
        }
    })
}

const removeCurrentTiles = (wrapper) => {
    const tilesWrapper = wrapper;
    const tiles = tilesWrapper.querySelectorAll('.fet-tile');
    tiles.forEach(item => {
        item.classList.add('fet-tile--fade-out');
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
        document.querySelector('.fet-section--category').scrollIntoView();
    }
}

const swapCategoryTiles = (event, category) => {
    const tilesWrapper = document.querySelector('.fet-tiles--category');
    if (!event.target.classList.contains('fet-categories__item--active')) {
        btnsStateHandler(event);
        removeCurrentTiles(tilesWrapper);
        setTimeout(() => {
            generateNewTiles(category, tilesWrapper);
        }, 400)
        scrollToTilesOnMobile()
    }
}

const categoryBtnsHandler = () => {
    const btns = document.querySelectorAll('.fet-categories__item');
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
    const categoryBtn = document.querySelector('.fet-categories__item');
    categoryBtn.click();
    preventInitialScrollOnMobile();
}

window.onload = () => {
    generateLatestTiles();
    categoryBtnsHandler();
    generateInitialTiles();
}