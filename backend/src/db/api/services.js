
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ServicesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const services = await db.services.create(
            {
                id: data.id || undefined,

        name: data.name
        ||
        null
            ,

        price: data.price
        ||
        null
            ,

        description: data.description
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return services;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const servicesData = data.map((item, index) => ({
                id: item.id || undefined,

                name: item.name
            ||
            null
            ,

                price: item.price
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const services = await db.services.bulkCreate(servicesData, { transaction });

        return services;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const services = await db.services.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.name !== undefined) updatePayload.name = data.name;

        if (data.price !== undefined) updatePayload.price = data.price;

        if (data.description !== undefined) updatePayload.description = data.description;

        updatePayload.updatedById = currentUser.id;

        await services.update(updatePayload, {transaction});

        return services;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const services = await db.services.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of services) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of services) {
                await record.destroy({transaction});
            }
        });

        return services;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const services = await db.services.findByPk(id, options);

        await services.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await services.destroy({
            transaction
        });

        return services;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const services = await db.services.findOne(
            { where },
            { transaction },
        );

        if (!services) {
            return services;
        }

        const output = services.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'services',
                            'name',
                            filter.name,
                        ),
                    };
                }

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'services',
                            'description',
                            filter.description,
                        ),
                    };
                }

            if (filter.priceRange) {
                const [start, end] = filter.priceRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    price: {
                    ...where.price,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    price: {
                    ...where.price,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.services.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'services',
                        'name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.services.findAll({
            attributes: [ 'id', 'name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.name,
        }));
    }

};

