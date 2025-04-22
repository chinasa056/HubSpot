const { initiateHostPayout } = require("../controllers/payoutController");
const { hostAuth } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/host/payout:
 *   post:
 *     summary: Initiate host payout
 *     tags: [Payput]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       This endpoint initiates a payout request for a host based on their current balance. 
 *       The payout is sent to the host's registered bank account via KoraPay. The host must have a positive balance. 
 *       The payout request includes details such as amount, bank code, account number, and host contact information.
 *
 *       If the payout is accepted by KoraPay and enters a "processing" status, a Payment record is created with a processing status.
 *       If KoraPay rejects the payout, a Payment record is created with a failed status.
 *
 *       Fields such as current balance, full name, and bank account number must already be available in the host's profile.
 *     responses:
 *       200:
 *         description: Payout request sent successfully and is processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reference:
 *                   type: string
 *                 amount:
 *                   type: number
 *       400:
 *         description: Insufficient balance for payout
 *       404:
 *         description: Host not found
 *       500:
 *         description: Error initiating payout
 */
router.post("/host/payout", hostAuth, initiateHostPayout)

module.exports = router