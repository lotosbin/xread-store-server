import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import styles from "./AppBar.module.css";
import {useTranslation} from "react-i18next";

const _styles = {
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};


function ButtonAppBar(props) {
    const {t} = useTranslation("", {useSuspense: false});
    const {classes} = props;
    return <div>
        <AppBar position="static">
            <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit" component={"a"} href="//www.xread.yuanjingtech.com" target="_blank">{t('xRead')}</Typography>
                <Typography variant="h6" color="inherit" component={Link} to="/">{t('Store')}</Typography>

                <div className={styles.nav}>
                    <Button className={styles.nav_item} color="inherit" component={Link} to="/">{t('Home')}</Button>
                    <Button className={styles.nav_item} color="inherit" component={"a"} href="http://feathub.com/lotosbin/xread-store" target="_blank">{t('Advice')}</Button>
                </div>
            </Toolbar>
        </AppBar>
    </div>;
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(_styles)(ButtonAppBar);