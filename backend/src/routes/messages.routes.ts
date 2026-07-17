import { Router } from 'express';
import { MessagesController } from '../controllers/messages.controller';
import { validate, createMessageSchema, updateMessageSchema } from '../middleware/validation';

export const createMessagesRoutes = (controller: MessagesController): Router => {
  const router = Router();

  /**
   * @openapi
   * /api/messages:
   *   get:
   *     tags: [Messages]
   *     summary: Get all messages
   *     responses:
   *       200:
   *         description: List of all messages
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   text:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   */
  router.get('/', controller.getAll);

  /**
   * @openapi
   * /api/messages/{id}:
   *   get:
   *     tags: [Messages]
   *     summary: Get message by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Message found
   *       404:
   *         description: Message not found
   */
  router.get('/:id', controller.getById);

  /**
   * @openapi
   * /api/messages:
   *   post:
   *     tags: [Messages]
   *     summary: Create a new message
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - text
   *             properties:
   *               text:
   *                 type: string
   *     responses:
   *       201:
   *         description: Message created
   *       400:
   *         description: Validation error
   */
  router.post('/', validate(createMessageSchema), controller.create);

  /**
   * @openapi
   * /api/messages/{id}:
   *   put:
   *     tags: [Messages]
   *     summary: Update message by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 type: string
   *     responses:
   *       200:
   *         description: Message updated
   *       400:
   *         description: Validation error
   *       404:
   *         description: Message not found
   */
  router.put('/:id', validate(updateMessageSchema), controller.update);

  /**
   * @openapi
   * /api/messages/{id}:
   *   delete:
   *     tags: [Messages]
   *     summary: Delete message by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Message deleted
   *       404:
   *         description: Message not found
   */
  router.delete('/:id', controller.delete);

  return router;
};
