
class SearchRepositories {
    constructor() {
        this.nameRepository = document.querySelector('.repositories__input')
        this.foundRepositories = document.querySelector('.listFoundRepositories')
        this.SavedRepositories = document.querySelector('.listSavedRepositories')

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
        const value = this.nameRepository.value
        if (value.trim()) {
            return await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
                .then((rep) => {

                    if (rep.ok) {
                        this.clearfoundRepositories()
                        rep.json().then(rep => {
                            if (!rep.items.length) this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
                            rep.items.forEach(repositories => {
                                this.repositoriesData.push({
                                    id: repositories.id,
                                    name: repositories.name,
                                    owner: repositories.owner.login,
                                    stars: repositories['stargazers_count'],
                                })
                                const item = this.createElement('li', 'listFoundRepositories__item')
                                item.innerHTML = repositories.name;
                                item.dataset.id = repositories.id
                                this.foundRepositories.append(item)
                                this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
                            })
                        })
                    }
                })

        }
        else {
            this.clearfoundRepositories()
            this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
        }
    }

    addRepositories(elem) {
        if (elem.target.className == "listFoundRepositories__item") {
            const [addElemnt] = this.repositoriesData.filter((element) => element.id == elem.target.dataset.id)
            if (this.repositoriesDataId.indexOf(addElemnt.id) != -1) {
                this.clearfoundRepositories()
                this.foundRepositories.style.height = this.repositoriesData.length * 40 + 'px'
                this.nameRepository.value = ''
                return true
            }
            this.repositoriesDataId.push(addElemnt.id)
            const item = this.createElement('li', 'listSavedRepositories__item');
            item.innerHTML = `<ul class="listInfoRepositories">
                                <li class="listInfoRepositories__item">Name: ${addElemnt.name}</li>
                                <li class="listInfoRepositories__item">Owner: ${addElemnt.owner}</li>
                                <li class="listInfoRepositories__item">Stars: ${addElemnt.stars}</li>
                             </ul>`
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