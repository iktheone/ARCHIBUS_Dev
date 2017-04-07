CREATE OR REPLACE VIEW gpc AS SELECT gp.gp_id AS gp_id, fl.fl_id AS fl_id, bl.bl_id AS bl_id, site.site_id AS site_id, ( gp.area * fl.area_fl_comn_gp / DECODE(fl.area_gp_dp,0,9999999999,fl.area_gp_dp)) AS flcomgp, ( gp.area * bl.area_bl_comn_gp / DECODE(bl.area_gp_dp,0,9999999999,bl.area_gp_dp)) AS blcomgp, NVL( ( gp.area * site.area_st_comn_gp / DECODE(site.area_gp_dp,0,9999999999,site.area_gp_dp)),0) AS stcomgp, ( gp.area * fl.area_fl_comn_serv / DECODE(fl.area_gp_dp,0,9999999999,fl.area_gp_dp)) AS flcomsrv, ( gp.area * bl.area_bl_comn_serv / DECODE(bl.area_gp_dp,0,9999999999,bl.area_gp_dp)) AS blcomsrv, NVL( ( gp.area * site.area_st_comn_serv / DECODE(site.area_gp_dp,0,9999999999,site.area_gp_dp)),0) AS stcomsrv FROM gp, fl, bl, site WHERE gp.dp_id IS NOT NULL AND gp.fl_id = fl.fl_id AND gp.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND site.site_id (+) = bl.site_id;

CREATE OR REPLACE VIEW rmc AS SELECT rm.rm_id AS rm_id, rm.fl_id AS fl_id, rm.bl_id AS bl_id, site.site_id AS site_id, ( rm.area * fl.area_fl_comn_rm / DECODE(fl.area_rm_dp,0,9999999999,fl.area_rm_dp)) AS flcomrm, ( rm.area * bl.area_bl_comn_rm / DECODE(bl.area_rm_dp,0,9999999999,bl.area_rm_dp)) AS blcomrm, NVL( ( rm.area * site.area_st_comn_rm / DECODE(site.area_rm_dp,0,9999999999,site.area_rm_dp)),0) AS stcomrm, ( rm.area * fl.area_fl_comn_serv / DECODE(fl.area_rm_dp,0,9999999999,fl.area_rm_dp)) AS flcomsrv, ( rm.area * bl.area_bl_comn_serv / DECODE(bl.area_rm_dp,0,9999999999,bl.area_rm_dp)) AS blcomsrv, NVL( ( rm.area * site.area_st_comn_serv / DECODE(site.area_rm_dp,0,9999999999,site.area_rm_dp)),0) AS stcomsrv FROM rm, fl, bl, site WHERE rm.dp_id IS NOT NULL AND rm.fl_id = fl.fl_id AND rm.bl_id = fl.bl_id AND rm.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND site.site_id (+) = bl.site_id;

CREATE OR REPLACE VIEW rmpctc AS SELECT rmpct.pct_id AS pct_id, rmpct.rm_id AS rm_id, fl.fl_id AS fl_id, bl.bl_id AS bl_id, site.site_id AS site_id, ( rmpct.area_rm * fl.area_fl_comn_rm / DECODE(fl.area_rm_dp,0,9999999999,fl.area_rm_dp)) AS flcomrm, ( rmpct.area_rm * bl.area_bl_comn_rm / DECODE(bl.area_rm_dp,0,9999999999,bl.area_rm_dp)) AS blcomrm, NVL((rmpct.area_rm * site.area_st_comn_rm / DECODE(site.area_rm_dp,0,9999999999,site.area_rm_dp)),0) AS stcomrm, ( rmpct.area_rm * fl.area_fl_comn_serv / DECODE(fl.area_rm_dp,0,9999999999,fl.area_rm_dp)) AS flcomsrv, ( rmpct.area_rm * bl.area_bl_comn_serv / DECODE(bl.area_rm_dp,0,9999999999,bl.area_rm_dp)) AS blcomsrv, NVL((rmpct.area_rm * site.area_st_comn_serv/DECODE(site.area_rm_dp,0,9999999999,site.area_rm_dp)),0) AS stcomsrv FROM rmpct, fl, bl, site WHERE rmpct.dp_id IS NOT NULL AND rmpct.fl_id = fl.fl_id AND rmpct.bl_id = fl.bl_id AND rmpct.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND site.site_id (+) = bl.site_id;

CREATE OR REPLACE VIEW alrmc AS SELECT rm.rm_id AS rm_id, rm.fl_id AS fl_id, rm.bl_id AS bl_id, site.site_id AS site_id, ( rm.area * fl.area_fl_comn_ocup / DECODE(fl.area_ocup_dp,0,9999999999,fl.area_ocup_dp)) AS flcomocup, ( rm.area * bl.area_bl_comn_ocup / DECODE(bl.area_ocup_dp,0,9999999999,bl.area_ocup_dp)) AS blcomocup, NVL( ( rm.area * site.area_st_comn_ocup / DECODE(site.area_ocup_dp,0,9999999999,site.area_ocup_dp)),0) AS stcomocup, ( rm.area * fl.area_fl_comn_nocup / DECODE(fl.area_ocup_dp,0,9999999999,fl.area_ocup_dp)) AS flcomnocup, ( rm.area * bl.area_bl_comn_nocup / DECODE(bl.area_ocup_dp,0,9999999999,bl.area_ocup_dp)) AS blcomnocup, NVL( ( rm.area * site.area_st_comn_nocup / DECODE(site.area_ocup_dp,0,9999999999,site.area_ocup_dp)),0) AS stcomnocup FROM rm, rmcat, fl, bl, site WHERE rm.dp_id IS NOT NULL AND rmcat.occupiable = 1 AND rm.rm_cat = rmcat.rm_cat AND rm.fl_id = fl.fl_id AND rm.bl_id = fl.bl_id AND rm.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND site.site_id (+) = bl.site_id;

CREATE OR REPLACE VIEW alrmpctc AS SELECT rmpct.pct_id AS pct_id, rmpct.rm_id AS rm_id, rmpct.fl_id AS fl_id, rmpct.bl_id AS bl_id, site.site_id AS site_id, ( rmpct.area_rm * fl.area_fl_comn_ocup / DECODE(fl.area_ocup_dp,0,9999999999,fl.area_ocup_dp)) AS flcomocup, ( rmpct.area_rm * bl.area_bl_comn_ocup / DECODE(bl.area_ocup_dp,0,9999999999,bl.area_ocup_dp)) AS blcomocup, NVL((rmpct.area_rm * site.area_st_comn_ocup/DECODE(site.area_ocup_dp,0,9999999999,site.area_ocup_dp)),0) AS stcomocup, ( rmpct.area_rm * fl.area_fl_comn_nocup / DECODE(fl.area_ocup_dp,0,9999999999,fl.area_ocup_dp)) AS flcomnocup, ( rmpct.area_rm * bl.area_bl_comn_nocup / DECODE(bl.area_ocup_dp,0,9999999999,bl.area_ocup_dp)) AS blcomnocup, NVL((rmpct.area_rm *site.area_st_comn_nocup/DECODE(site.area_ocup_dp,0,9999999999,site.area_ocup_dp)),0) AS stcomnocup FROM rmpct, rmcat, fl, bl, site WHERE rmpct.dp_id IS NOT NULL AND rmcat.occupiable = 1 AND rmpct.rm_cat = rmcat.rm_cat AND rmpct.fl_id = fl.fl_id AND rmpct.bl_id = fl.bl_id AND rmpct.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND site.site_id (+) = bl.site_id;

CREATE OR REPLACE VIEW emcic AS SELECT rm.rm_id AS rm_id, rm.fl_id AS fl_id, rm.bl_id AS bl_id, site.site_id AS site_id, ( rm.area * fl.area_fl_comn_rm / DECODE(fl.area_em_dp,0,9999999999,fl.area_em_dp)) AS flcomrm, ( rm.area * bl.area_bl_comn_rm / DECODE(bl.area_em_dp,0,9999999999,bl.area_em_dp)) AS blcomrm, ( rm.area * site.area_st_comn_rm / DECODE(site.area_em_dp,0,9999999999,site.area_em_dp)) AS stcomrm, ( rm.area * fl.area_fl_comn_serv / DECODE(fl.area_em_dp,0,9999999999,fl.area_em_dp)) AS flcomsrv, ( rm.area * bl.area_bl_comn_serv / DECODE(bl.area_em_dp,0,9999999999,bl.area_em_dp)) AS blcomsrv, ( rm.area * site.area_st_comn_serv / DECODE(site.area_em_dp,0,9999999999,site.area_em_dp)) AS stcomsrv FROM rm,fl,bl,site WHERE rm.count_em > 0 AND rm.fl_id = fl.fl_id AND rm.bl_id = fl.bl_id AND rm.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND bl.site_id = site.site_id;

CREATE OR REPLACE VIEW emarc AS SELECT rm.rm_id AS rm_id, rm.fl_id AS fl_id, rm.bl_id AS bl_id, site.site_id AS site_id, ( rm.area * fl.area_fl_comn_ocup / DECODE(fl.area_em_dp,0,9999999999,fl.area_em_dp)) AS flcomocup, ( rm.area * bl.area_bl_comn_ocup / DECODE(bl.area_em_dp,0,9999999999,bl.area_em_dp)) AS blcomocup, ( rm.area * site.area_st_comn_ocup / DECODE(site.area_em_dp,0,9999999999,site.area_em_dp)) AS stcomocup, ( rm.area * fl.area_fl_comn_nocup / DECODE(fl.area_em_dp,0,9999999999,fl.area_em_dp)) AS flcomnocup, ( rm.area * bl.area_bl_comn_nocup / DECODE(bl.area_em_dp,0,9999999999,bl.area_em_dp)) AS blcomnocup, ( rm.area * site.area_st_comn_nocup / DECODE(site.area_em_dp,0,9999999999,site.area_em_dp)) AS stcomnocup FROM rm,fl,bl,site WHERE rm.count_em > 0 AND rm.fl_id = fl.fl_id AND rm.bl_id = fl.bl_id AND rm.bl_id = bl.bl_id AND fl.bl_id = bl.bl_id AND bl.site_id = site.site_id;

CREATE OR REPLACE VIEW rmpctbdd AS SELECT DISTINCT site_id,rmpct.bl_id,rmpct.fl_id,rmpct.rm_id,rmpct.dv_id,rmpct.dp_id,rm_std FROM rmpct,rm,bl WHERE rmpct.bl_id = bl.bl_id AND rmpct.bl_id = rm.bl_id AND rmpct.fl_id = rm.fl_id AND rmpct.rm_id = rm.rm_id;

CREATE OR REPLACE VIEW rmpcttc AS SELECT DISTINCT site_id,rmpct.bl_id,fl_id,rm_id,rm_cat,rm_type  FROM rmpct,bl WHERE rmpct.bl_id = bl.bl_id;
