
class SearchRepositories {
    constructor() {
        this.nameRepository = document.querySelector('.repositories__input')
        this.foundRepositories = document.querySelector('.listFoundRepositories')
        this.SavedRepositories = document.querySelector('.repositories__listSavedRepositories')

        this.repositoriesData = []
        this.repositoriesDataId = []
        this.nameRepository.addEventListener('keyup', this.debounce(this.search.bind(this), 400));
        this.foundRepositories.addEventListener('click', this.addRepositories.bind(this))
    }
    createElement(element, className) {
        const item = document.createElement(element);
        item.classList.add(className)
        return item
    }
    clearfoundRepositories() {
        this.foundRepositories.innerHTML = '';
        this.repositoriesData = []
    }
    async search() {
        const value = this.nameRepository.value.trim()
        if (!value) {
            this.clearfoundRepositories()
            this.foundRepositories.style.height = '0px'
            return
        }
        const requestGit = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        if (!requestGit.ok) return
        this.clearfoundRepositories()
        const rep = await requestGit.json()
        if (!rep.items.length) this.foundRepositories.style.height = '0px'
        rep.items.forEach(repositories => {
            this.repositoriesData.push({
                id: repositories.id,
                name: repositories.name,
                owner: repositories.owner.login,
                stars: repositories['stargazers_count'],
            })
            const item = this.createElement('li', 'listFoundRepositories__item')
            const btnItem =  this.createElement('button', 'listFoundRepositories__btn')
            btnItem.innerHTML = repositories.name;
            btnItem.dataset.id = repositories.id
            item.append(btnItem)
            this.foundRepositories.append(item)
            this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
        })
    }

    addRepositories(elem) {
        if (elem.target.className != "listFoundRepositories__btn") return false
        const [addElemnt] = this.repositoriesData.filter((element) => element.id == elem.target.dataset.id)
        if (this.repositoriesDataId.indexOf(addElemnt.id) != -1) {
            this.clearfoundRepositories()
            this.foundRepositories.style.height = '0px'
            this.nameRepository.value = ''
            return true
        }
        this.repositoriesDataId.push(addElemnt.id)
        const item = this.createElement('div', 'savedRepositories');
        item.innerHTML = `<div class="repositories__infoRepositories">
                                <div class="infoRepositories">Name: ${addElemnt.name}</div>
                                <div class="infoRepositories">Owner: ${addElemnt.owner}</div>
                                <div class="infoRepositories">Stars: ${addElemnt.stars}</div>
                             </div>`
        this.SavedRepositories.append(item)
        const btn = this.createElement('button', 'repositories__button');
        btn.addEventListener('click', () => {
            btn.parentElement.remove()
            this.repositoriesDataId.pop(addElemnt.id)
        })
        item.append(btn)
        this.clearfoundRepositories()
        this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
        this.nameRepository.value = ''
        return true

    }

    debounce(fn, debounceTime) {
        let time
        return function (...arg) {
            clearTimeout(time)
            time = setTimeout(() => fn.apply(this, arg), debounceTime)
        }
    };

}

new SearchRepositories()