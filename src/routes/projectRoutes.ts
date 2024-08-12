import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErros } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErros,
    ProjectController.createProject)
router.get('/',
    ProjectController.getAllProjects);
router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErros,
    ProjectController.getProjectById);

router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErros,
    ProjectController.updateProject);

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErros,
    ProjectController.deleteProject);



/* Router for  task */
router.param("projectId", ProjectExists);
router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre del tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatorio'),
    handleInputErros,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErros,
    TaskController.getTaskById
)


router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre del tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatorio'),
    handleInputErros,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErros,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErros,
    TaskController.updateStatus
)

/* Routes for teams */
router.post('/:projectId/team/find', 
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valido'),
        handleInputErros,
        TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team', 
    TeamMemberController.getProjectTeam
   
)


router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('ID no válido'),
        handleInputErros,
        TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('ID no válido'),
        handleInputErros,
        TeamMemberController.removeMemberById
)

/* Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErros,
    NoteController.createNote
 )

 router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNote
 )

 router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    handleInputErros,
    NoteController.deleteNote
 )

export default router