const { History, Packet } = require('../models');

const getAllHistories = async (req, res) => {
    try {
        const histories = await History.findAll({
            include: [{
                model: Packet,
                as: 'packet',
                attributes: ['id', 'destination', 'receipt_number']
            }],
            order: [['createdAt', 'DESC']]
        });
        if (!histories || histories.length === 0) {
            return res.status(404).json({
                message: 'No histories found'
            });
        }
        res.status(200).json({
            message: 'Histories retrieved successfully',
            histories: histories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving histories',
            error
        });
    }
};


const createHistory = async (req, res) => {
    try {
        const { id_packet, status } = req.body;
        const packet_result = await Packet.findOne({
            where: { id: id_packet }
        });

        if (!packet_result) {
            return res.status(404).json({ message: 'Packet not found' });
        }
        const status_packet = status;
        const newHistory = await History.create({ id_packet, packet_name: packet_result.packet_name, status });
        const packet = await Packet.findByPk(id_packet);
        if (!packet) {
            return res.status(404).json({ message: 'Packet not found' });
        }
        await packet.update({ status: status_packet });
        res.status(201).json({ message: 'History created successfully', data: newHistory, packet: packet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating history', error });
    }
}

const updateHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_packet, packet_name, status } = req.body;
        const historyToUpdate = await History.findByPk(id);

        if (!historyToUpdate) {
            return res.status(404).json({ message: 'History not found' });
        }

        historyToUpdate.id_packet = id_packet;
        historyToUpdate.packet_name = packet_name;    
        historyToUpdate.status = status;

        await historyToUpdate.save();
        res.status(200).json({ message: 'History updated successfully', history: historyToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating history', error });
    }
}

const deleteHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const historyToDelete = await History.findByPk(id);
        if (!historyToDelete) {
            return res.status(404).json({ message: 'History not found' });
        }
        await historyToDelete.destroy();
        res.status(200).json({ message: 'History deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting history', error });
    }
}

module.exports = {
    getAllHistories,
    createHistory,
    updateHistory,
    deleteHistory
};