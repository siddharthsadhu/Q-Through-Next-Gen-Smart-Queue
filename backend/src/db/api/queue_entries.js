
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Queue_entriesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const queue_entries = await db.queue_entries.create(
            {
                id: data.id || undefined,

        joined_at: data.joined_at
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return queue_entries;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const queue_entriesData = data.map((item, index) => ({
                id: item.id || undefined,

                joined_at: item.joined_at
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const queue_entries = await db.queue_entries.bulkCreate(queue_entriesData, { transaction });

        return queue_entries;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const queue_entries = await db.queue_entries.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.joined_at !== undefined) updatePayload.joined_at = data.joined_at;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await queue_entries.update(updatePayload, {transaction});

        return queue_entries;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const queue_entries = await db.queue_entries.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of queue_entries) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of queue_entries) {
                await record.destroy({transaction});
            }
        });

        return queue_entries;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const queue_entries = await db.queue_entries.findByPk(id, options);

        await queue_entries.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await queue_entries.destroy({
            transaction
        });

        return queue_entries;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const queue_entries = await db.queue_entries.findOne(
            { where },
            { transaction },
        );

        if (!queue_entries) {
            return queue_entries;
        }

        const output = queue_entries.get({plain: true});

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

            if (filter.joined_atRange) {
                const [start, end] = filter.joined_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    joined_at: {
                    ...where.joined_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    joined_at: {
                    ...where.joined_at,
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

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
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
            const { rows, count } = await db.queue_entries.findAndCountAll(queryOptions);

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
                        'queue_entries',
                        'status',
                        query,
                    ),
                ],
            };
        }

        const records = await db.queue_entries.findAll({
            attributes: [ 'id', 'status' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['status', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.status,
        }));
    }

};

