var express = require('express');
var router = express.Router();

var guest_controller = require('../controllers/guestController');

// ����������� ��������� ��������
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Abuela de donna' });
});

router.get('/guest_all', guest_controller.guest_all)

//�������� �����
router.get('/guest/create', guest_controller.guest_create_get);

router.post('/guest/create', guest_controller.guest_create_post);

//�������� ���������� �� ���������� �����
router.get('/guest/:id', guest_controller.guest_detail);

//�������� ��������� �����
router.get('/guest/:id/update', guest_controller.guest_change_get);

router.post('/guest/:id/update', guest_controller.guest_change_post);

// ������� �����
router.post('/guest/:id/delete', guest_controller.guest_delete_post);


module.exports = router;
