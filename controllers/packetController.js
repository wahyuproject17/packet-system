const { Packet } = require('../models');
const { Op } = require('sequelize');

const getAllPackets = async (req, res) => {
    try {
        const packets = await Packet.findAll();
        res.status(200).json({ message: 'Packets retrieved successfully', packets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving packets', error });
    }
}

const createPacket = async (req, res) => {
    try {
        const { packet_name, receipt_number, destination } = req.body;
        const status = 'belum disortir'; // Default status for new packets
        const newPacket = await Packet.create({ packet_name, receipt_number, destination, status });
        res.status(201).json({ message: 'Packet created successfully', data: newPacket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating packet', error });
    }
}

const updatePacket = async (req, res) => {
  try {
    const { id } = req.params; // ID dari parameter URL
    const { packet_name, status, receipt_number, destination } = req.body;

    // Cari packet berdasarkan ID
    const packet = await Packet.findByPk(id);

    if (!packet) {
      return res.status(404).json({ message: 'Packet not found' });
    }

    // Update data yang dikirim dari body
    await packet.update({
      packet_name,
      status,
      receipt_number,
      destination
    });

    res.status(200).json({ message: 'Packet updated successfully', data: packet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating packet', error });
  }
};


const deletePacket = async (req, res) => {
    try {
        const { id } = req.params;
        const packetToDelete = await Packet.findByPk(id);
        if (!packetToDelete) {
            return res.status(404).json({ message: 'Packet not found' });
        }
        await packetToDelete.destroy();
        res.status(200).json({ message: 'Packet deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting packet', error });
    }
};


module.exports = {
    getAllPackets,
    createPacket,
    updatePacket,
    deletePacket
};