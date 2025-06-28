const { Packet, User } = require('../models');
const getDashboardData = async (req, res) => {
    try {
        const totalPackets = await Packet.count();
        const totalUsers = await User.count();
        const packets = await Packet.findAll({
            attributes: ['id', 'packet_name', 'receipt_number', 'destination', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            data: {
                totalPackets,
                totalUsers,
                recentPackets: packets
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving dashboard data',
            error
        });
    }
};

module.exports = {
    getDashboardData
};