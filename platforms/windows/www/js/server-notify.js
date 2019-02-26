$(document).ready(function () {
    <?php if (isset($_SESSION['init_login'])) { unset($_SESSION['init_login']);?>
    notify2("Welcome back, <?=$acct->fname;?>!", "success");
    <?php } ?>

    <?php if (isset($_SESSION['notify'])) {?>
    var serverNotify = new Notify2("<?=$_SESSION['notify']->message;?>", "<?=$_SESSION['notify']->class;?>");
    serverNotify.setAutoHide(<?=$_SESSION['notify']->autoHide;?>);
    serverNotify.setDelay(<?=$_SESSION['notify']->delay;?>);
    <?php if ($_SESSION['notify']->doConfirm) {?>
    serverNotify.doConfirm();
    <?php } ?>
    serverNotify.notify();
    <?php unset($_SESSION['notify']); } ?>
});