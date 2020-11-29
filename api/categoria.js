module.exports = app => {
    const { existeOuErro, naoExisteOuErro } = app.api.validador

    const salvar = (req, res) => {
        const categoria = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }

        if (req.params.id) categoria.id = req.params.id

        try {
            existeOuErro(categoria.name, 'Nome da categoria não informado.')
            if (categoria.id === categoria.parentId && categoria.id !== undefined && categoria.parentId !== undefined)
                throw 'Categoria não pode ser pai do mesmo!'
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (categoria.id) {
            app.db('categories')
                .update(categoria)
                .where({ id: categoria.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(categoria)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remover = async (req, res) => {
        try {
            existeOuErro(req.params.id, 'Código da Categoria não informado.')

            const subcategoria = await app.db('categories')
                .where({ parentId: req.params.id })
            naoExisteOuErro(subcategoria, 'A categoria selecionada possui subcategorias associadas.')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            naoExisteOuErro(articles, 'Categoria possui artigos.')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existeOuErro(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(categoria => {
            let path = categoria.name
            let parent = getParent(categories, categoria.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...categoria, path }
        })

        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const obter = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const obterPorId = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(categoria => res.json(categoria))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if (!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const obterArvore = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { salvar, remover, obter, obterPorId, obterArvore }
}