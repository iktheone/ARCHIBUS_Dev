INSERT INTO afm_flds_lang (table_name, field_name) SELECT table_name, field_name FROM afm_flds WHERE NOT EXISTS (SELECT 1 FROM afm_flds_lang afm_flds_lang_inner WHERE afm_flds_lang_inner.table_name = afm_flds.table_name AND afm_flds_lang_inner.field_name = afm_flds.field_name) AND afm_flds.table_name IN ('resview','resrmview','resrsview','rrdayrmresplus','rrwrrestr','rrdayrmres','rrcostdet','rrmoncostdp','rrmonusearr','rrdayrmocc','rrmonresrej','rrdayrresplus','rrdayresocc','rrmonthresquant','rrmonnumrres','rrressheet','rrressheetplus','rrappdet','rrmonrmcap','rrmonreq');

IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrdayrmresplus' AND type = 'V') DROP VIEW rrdayrmresplus;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrwrrestr' AND type = 'V') DROP VIEW rrwrrestr;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrdayrmres' AND type = 'V') DROP VIEW rrdayrmres;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrcostdet' AND type = 'V') DROP VIEW rrcostdet;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmoncostdp' AND type = 'V') DROP VIEW rrmoncostdp;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonusearr' AND type = 'V') DROP VIEW rrmonusearr;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrdayrmocc' AND type = 'V') DROP VIEW rrdayrmocc;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrdayrresplus' AND type = 'V') DROP VIEW rrdayrresplus;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonresrej' AND type = 'V') DROP VIEW rrmonresrej;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrdayresocc' AND type = 'V') DROP VIEW rrdayresocc;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonthresquant' AND type = 'V') DROP VIEW rrmonthresquant;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonnumrres' AND type = 'V') DROP VIEW rrmonnumrres;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrressheet' AND type = 'V') DROP VIEW rrressheet;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrressheetplus' AND type = 'V') DROP VIEW rrressheetplus;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrappdet' AND type = 'V') DROP VIEW rrappdet;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonrmcap' AND type = 'V') DROP VIEW rrmonrmcap;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'rrmonreq' AND type = 'V') DROP VIEW rrmonreq;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'resrmview' AND type = 'V') DROP VIEW resrmview;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'resrsview' AND type = 'V') DROP VIEW resrsview;
IF EXISTS (SELECT 1 FROM sysobjects WHERE name = 'resview' AND type = 'V') DROP VIEW resview;

CREATE VIEW resview AS (SELECT recurring_rule,doc_event,ac_id,comments,user_created_by,cost_res,date_cancelled,date_last_modified,date_created,dp_id,dv_id,phone,user_requested_by,contact,date_end,date_start,res_id,user_requested_for,user_last_modified_by,email,reservation_name,status,time_end,time_start,res_type,res_parent,recurring_date_modified,attendees,res_conference FROM reserve) UNION ALL (SELECT recurring_rule,doc_event,ac_id,comments,user_created_by,cost_res,date_cancelled,date_last_modified,date_created,dp_id,dv_id,phone,user_requested_by,contact,date_end,date_start,res_id,user_requested_for,user_last_modified_by,email,reservation_name,status,time_end,time_start,res_type,res_parent,recurring_date_modified,attendees,res_conference FROM hreserve);
CREATE VIEW resrmview AS (SELECT rmres_id,comments,cost_rmres,date_cancelled,date_last_modified,date_created,bl_id,date_start,res_id,user_last_modified_by,status,time_end,time_start,config_id,fl_id,rm_arrange_type_id,rm_id,recurring_order,date_rejected,guests_external,guests_internal,verified, attendees_in_room FROM reserve_rm) UNION ALL (SELECT rmres_id,comments,cost_rmres,date_cancelled,date_last_modified,date_created,bl_id,date_start,res_id,user_last_modified_by,status,time_end,time_start,config_id,fl_id,rm_arrange_type_id,rm_id,recurring_order,date_rejected,guests_external,guests_internal,verified, attendees_in_room FROM hreserve_rm);
CREATE VIEW resrsview AS (SELECT comments,date_cancelled,date_created,date_start,user_last_modified_by,time_end,rm_id,rsres_id,cost_rsres,date_last_modified,bl_id,res_id,status,time_start,fl_id,recurring_order,date_rejected,quantity,resource_id FROM reserve_rs) UNION ALL (SELECT comments,date_cancelled,date_created,date_start,user_last_modified_by,time_end,rm_id,rsres_id,cost_rsres,date_last_modified,bl_id,res_id,status,time_start,fl_id,recurring_order,date_rejected,quantity,resource_id FROM hreserve_rs);
CREATE VIEW rrdayrmresplus AS (SELECT resrmview.bl_id,resrmview.date_start,resrmview.time_start,resrmview.time_end,     resview.res_id,resrmview.fl_id,resrmview.rm_id,'' AS resource_id,0 AS quantity,     resview.user_requested_for,resview.phone,resview.dv_id,resview.dp_id,resrmview.comments,     resrmview.rm_arrange_type_id,resrmview.guests_internal+resrmview.guests_external AS total_guest,resrmview.status,  	 bl.ctry_id,bl.site_id, resview.reservation_name, rm_arrange_type.tr_id,rm_arrange_type.vn_id FROM     resrmview LEFT OUTER JOIN     resview ON resrmview.res_id = resview.res_id LEFT OUTER JOIN     bl ON resrmview.bl_id = bl.bl_id LEFT OUTER JOIN     rm_arrange_type ON resrmview.rm_arrange_type_id =     rm_arrange_type.rm_arrange_type_id) UNION ALL (SELECT resrsview.bl_id,resrsview.date_start,resrsview.time_start,resrsview.time_end,resview.res_id,     resrsview.fl_id,resrsview.rm_id,resrsview.resource_id,resrsview.quantity,resview.user_requested_for,     resview.phone,resview.dv_id,resview.dp_id,resrsview.comments,'' AS rm_arrange_type_id,0 AS total_guests, resrsview.status ,     bl.ctry_id,bl.site_id, resview.reservation_name, resource_std.tr_id, resource_std.vn_id FROM     resrsview LEFT OUTER JOIN     resview ON resrsview.res_id = resview.res_id LEFT OUTER JOIN     bl ON resrsview.bl_id = bl.bl_id LEFT OUTER JOIN     resources ON resrsview.resource_id = resources.resource_id LEFT OUTER JOIN     resource_std ON resources.resource_std = resource_std.resource_std LEFT OUTER JOIN     resrmview ON resrsview.res_id = resrmview.res_id);
CREATE VIEW rrmonreq AS SELECT      Bl.ctry_id, bl.site_id, resrmview.bl_id, resrmview.fl_id, resrmview.rm_id, resrmview.rm_arrange_type_id,      resrmview.date_start, resview.dv_id, resview.dp_id, resview.status, resrmview.config_id, CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' end) + CAST(MONTH(resrmview.date_start) AS VARCHAR(2)) AS monthtxt,      CASE WHEN         'RESERVATION MANAGER' IN (SELECT group_name FROM afm_groupsforroles WHERE         afm_users.role_name = afm_groupsforroles.role_name)      THEN 'RESERVATION MANAGER'      ELSE      CASE WHEN         'RESERVATION SERVICE DESK' IN (SELECT group_name FROM afm_groupsforroles WHERE         afm_users.role_name = afm_groupsforroles.role_name)      THEN 'RESERVATION SERVICE DESK'      ELSE      CASE WHEN         'RESERVATION APPROVER' IN (SELECT group_name FROM afm_groupsforroles WHERE         afm_users.role_name = afm_groupsforroles.role_name)      THEN 'RESERVATION APPROVER'      ELSE      CASE WHEN         'RESERVATION ASSISTANT' IN (SELECT group_name FROM afm_groupsforroles WHERE         afm_users.role_name = afm_groupsforroles.role_name)      THEN 'RESERVATION ASSISTANT'      ELSE      CASE WHEN         'RESERVATION TRADES' IN (SELECT group_name FROM afm_groupsforroles WHERE         afm_users.role_name = afm_groupsforroles.role_name)      THEN 'RESERVATION TRADES'      ELSE      'RESERVATION HOST'      END      END      END      END      END AS usertype FROM      resrmview      LEFT OUTER JOIN resview ON resrmview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrmview.bl_id      LEFT OUTER JOIN em ON resview.user_created_by = em.em_id      LEFT OUTER JOIN afm_users ON afm_users.email = em.email;
CREATE VIEW rrmonrmcap AS SELECT Bl.ctry_id, bl.site_id, resrmview.bl_id,resrmview.fl_id,resrmview.rm_id, resrmview.rm_arrange_type_id, resrmview.config_id, resrmview.date_start, resview.dv_id, resview.dp_id, resrmview.time_start, resrmview.time_end, CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' end) + CAST(MONTH(resrmview.date_start) AS VARCHAR(2)) AS monthtxt, ROUND(CAST((resrmview.attendees_in_room) AS real)/rm_arrange.max_capacity * 100,2) AS capacity_use, resview.status FROM resrmview LEFT OUTER JOIN rm_arrange ON rm_arrange.bl_id = resrmview.bl_id AND rm_arrange.fl_id = resrmview.fl_id  AND      rm_arrange.rm_id = resrmview.rm_id  AND  rm_arrange.config_id = resrmview.config_id  AND      rm_arrange.rm_arrange_type_id = resrmview.rm_arrange_type_id      LEFT OUTER JOIN resview ON resrmview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrmview.bl_id;
CREATE VIEW rrmonresrej AS SELECT      Bl.ctry_id, bl.site_id, resrsview.bl_id,resrsview.fl_id,resrsview.resource_id, resources.resource_std,      resrsview.date_start,resview.dv_id, resview.dp_id,resrsview.status,  CAST(year(resrsview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrsview.date_start) < 10 THEN '0' ELSE '' end) + CAST(MONTH(resrsview.date_start) AS VARCHAR(2)) AS monthtxt FROM      resrsview      LEFT OUTER JOIN resview ON resrsview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrsview.bl_id      LEFT OUTER JOIN resources ON resrsview.resource_id = resources.resource_id;
CREATE VIEW rrmonnumrres AS SELECT      Bl.ctry_id, bl.site_id, CAST(year(resrsview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrsview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrsview.date_start) AS VARCHAR(2)) AS monthtxt, 	 resrsview.date_start, resrsview.bl_id, resrsview.time_start, resrsview.time_end, resrsview.fl_id, resources.resource_id,     resources.resource_std, resview.dv_id, resview.dp_id,resview.status FROM      resrsview LEFT OUTER JOIN resview ON resrsview.res_id = resview.res_id      LEFT OUTER JOIN bl ON resrsview.bl_id = bl.bl_id      LEFT OUTER JOIN resources ON resrsview.resource_id  = resources.resource_id;
CREATE VIEW rrmonusearr AS SELECT      Bl.ctry_id, bl.site_id, resrmview.bl_id,resrmview.fl_id,resrmview.rm_id,resrmview.date_start,      resrmview.time_start, resrmview.time_end, resrmview.rm_arrange_type_id, CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' end) + CAST(MONTH(resrmview.date_start) AS VARCHAR(2)) AS monthtxt,      resview.dv_id, resview.dp_id, resview.status, resrmview.config_id FROM      resrmview      LEFT OUTER JOIN resview ON resrmview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrmview.bl_id;
CREATE VIEW rrappdet AS (SELECT      resrmview.res_id, resrmview.date_start, resrmview.time_start, resrmview.time_end,      resview.user_requested_by, resrmview.bl_id, resrmview.fl_id, resrmview.rm_id,      resrmview.rm_arrange_type_id, '' AS resource_id, (resrmview.guests_internal+resrmview.guests_external) AS quantity,      resrmview.status, bl.ctry_id, bl.site_id, resrmview.config_id FROM      resrmview      LEFT OUTER JOIN resview ON resrmview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrmview.bl_id      LEFT OUTER JOIN rm_arrange ON rm_arrange.bl_id = resrmview.bl_id  AND  rm_arrange.fl_id = resrmview.fl_id  AND      rm_arrange.rm_id = resrmview.rm_id AND rm_arrange.config_id = resrmview.config_id AND      rm_arrange.rm_arrange_type_id = resrmview.rm_arrange_type_id WHERE    DATEDIFF(dd, resrmview.date_start, getdate()) <= rm_arrange.announce_days AND DATEDIFF(dd, resrmview.date_start, getdate()) >= 0 ) UNION ALL ( SELECT      resrsview.res_id, resrsview.date_start, resrsview.time_start, resrsview.time_end,      resview.user_requested_by, resrsview.bl_id, resrsview.fl_id, resrsview.rm_id,      '' AS rm_arrange_type_id, resrsview.resource_id, resrsview.quantity AS quantity, resrsview.status      , bl.ctry_id, bl.site_id,'' AS config_id FROM      resrsview      LEFT OUTER JOIN resview ON resrsview.res_id = resview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrsview.bl_id      LEFT OUTER JOIN resources ON resources.resource_id = resrsview.resource_id WHERE DATEDIFF(dd, resrsview.date_start, getdate()) <= resources.announce_days AND DATEDIFF(dd, resrsview.date_start, getdate()) >= 0 );
CREATE VIEW rrressheetplus AS (SELECT 	resview.res_id,	resview.date_start,bl.ctry_id,	bl.site_id,	resrmview.bl_id, 	resrmview.fl_id,resrmview.rm_id,resview.user_created_by,resview.user_requested_by,resview.user_requested_for, 	resview.dv_id,resview.dp_id,resview.reservation_name,resview.status FROM    resview LEFT OUTER JOIN    resrmview ON resview.res_id = resrmview.res_id LEFT OUTER JOIN    bl ON resrmview.bl_id = bl.bl_id) UNION ALL (SELECT resview.res_id,resview.date_start,     bl.ctry_id,bl.site_id,resrsview.bl_id,resrsview.fl_id,resrsview.rm_id,resview.user_created_by,     resview.user_requested_by,resview.user_requested_for,resview.dv_id,resview.dp_id,     resview.reservation_name,resview.status FROM     resview LEFT OUTER JOIN     resrsview ON resview.res_id = resrsview.res_id LEFT OUTER JOIN     bl ON resrsview.bl_id = bl.bl_id);
CREATE VIEW rrressheet AS SELECT DISTINCT res_id, date_start FROM rrressheetplus;
CREATE VIEW rrdayrmres AS SELECT 	resrmview.bl_id,bl.name,resrmview.date_start,resrmview.time_start, 	resrmview.time_end,resrmview.fl_id,resrmview.rm_id,resrmview.rm_arrange_type_id, 	resrmview.guests_internal+resrmview.guests_external AS total_guest,resview.res_id, 	resview.user_requested_for,resview.phone,resview.dv_id, 	resview.dp_id,resrmview.comments,bl.ctry_id,bl.site_id,resview.reservation_name, 	rm_arrange_type.tr_id,rm_arrange_type.vn_id,resview.status,resrmview.config_id, CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrmview.date_start) AS VARCHAR(2)) AS monthtxt  FROM     resrmview LEFT OUTER JOIN     resview ON resrmview.res_id = resview.res_id LEFT OUTER JOIN     bl ON resrmview.bl_id = bl.bl_id LEFT OUTER JOIN     rm_arrange_type ON resrmview.rm_arrange_type_id = rm_arrange_type.rm_arrange_type_id;
CREATE VIEW rrcostdet AS   (SELECT 		Resview.dv_id,resview.dp_id,resview.res_id,	resrmview.date_start,resrmview.time_start,resrmview.time_end,resview.user_requested_by, 		resrmview.bl_id,resrmview.fl_id,resrmview.rm_id,resrmview.rm_arrange_type_id, '' AS resource_id, 		(resrmview.guests_internal+resrmview.guests_external) AS quantity,resrmview.cost_rmres AS cost,resrmview.status,bl.ctry_id, 		bl.site_id,	resview.reservation_name, resrmview.config_id FROM     resrmview LEFT OUTER JOIN     resview ON resrmview.res_id = resview.res_id LEFT OUTER JOIN     bl ON bl.bl_id = resrmview.bl_id )	UNION ALL   (SELECT Resview.dv_id,resview.dp_id,resview.res_id,resrsview.date_start,resrsview.time_start,     resrsview.time_end,resview.user_requested_by,resrsview.bl_id,resrsview.fl_id,resrsview.rm_id,     '' AS rm_arrange_type_id, resrsview.resource_id,resrsview.quantity AS quantity,resrsview.cost_rsres AS cost,     resrsview.status,     bl.ctry_id,bl.site_id, resview.reservation_name, '' AS config_id FROM     resrsview LEFT OUTER JOIN     resview ON resrsview.res_id = resview.res_id LEFT OUTER JOIN     bl ON bl.bl_id = resrsview.bl_id );
CREATE VIEW rrmoncostdp AS (SELECT      bl.ctry_id, bl.site_id, resrmview.bl_id,resrmview.fl_id, resrmview.rm_id, resrmview.rm_arrange_type_id, resrmview.config_id,  	  resrmview.date_start, resview.dv_id, resview.dp_id, RTRIM(resview.dv_id) + ' - ' + RTRIM(resview.dp_id) AS dv_dp_id, 	resrmview.res_id, '' AS resource_id,  resrmview.cost_rmres AS cost, CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' END) + CAST (MONTH(resrmview.date_start) AS VARCHAR(2)) AS monthtxt FROM      resrmview      LEFT OUTER JOIN resview ON resrmview.res_id = resview.res_id      LEFT OUTER JOIN resrsview ON resrsview.res_id = resrmview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrmview.bl_id GROUP BY      bl.ctry_id, bl.site_id,      resrmview.bl_id, resrmview.fl_id, resrmview.date_start,      resview.dv_id, resview.dp_id, resview.dv_id, resrmview.cost_rmres,     resrmview.res_id, resrmview.rm_id, resrmview.rm_arrange_type_id, resrmview.config_id,      resrmview.rm_arrange_type_id)  UNION (SELECT      bl.ctry_id, bl.site_id, resrsview.bl_id,resrsview.fl_id, resrsview.rm_id, '' AS rm_arrange_type_id, '' AS config_id,      resrsview.date_start, resview.dv_id, resview.dp_id, RTRIM(resview.dv_id) + ' - ' + RTRIM(resview.dp_id) AS dv_dp_id,  resrsview.res_id, resrsview.resource_id, 	resrsview.cost_rsres AS cost, CAST(year(resrsview.date_start) AS VARCHAR(4)) + '-' + (CASE WHEN MONTH(resrsview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrsview.date_start) AS VARCHAR(2)) AS monthtxt FROM      resrsview      LEFT OUTER JOIN resview ON resrsview.res_id = resview.res_id      LEFT OUTER JOIN resrmview ON resrsview.res_id = resrmview.res_id      LEFT OUTER JOIN bl ON bl.bl_id = resrsview.bl_id GROUP BY      bl.ctry_id, bl.site_id, resrsview.bl_id,resrsview.fl_id, resrsview.rm_id, rm_arrange_type_id, config_id,      resrsview.date_start, resview.dv_id, resview.dp_id,resrsview.cost_rsres,resrsview.res_id, resrsview.resource_id);
CREATE VIEW rrdayrresplus AS SELECT resrsview.bl_id,bl.name,resrsview.date_start,resrsview.time_start,resrsview.time_end,resrsview.fl_id,     resrsview.rm_id,resources.resource_name,resrsview.quantity,resview.user_requested_for,resview.phone,     resview.dv_id,resview.dp_id,resrsview.comments,resrsview.status,bl.ctry_id,bl.site_id, resrsview.res_id,     resview.reservation_name,resource_std.tr_id,resource_std.vn_id,resources.resource_std,resources.resource_id FROM     resrsview LEFT OUTER JOIN     resview ON resrsview.res_id = resview.res_id LEFT OUTER JOIN     bl ON resrsview.bl_id = bl.bl_id LEFT OUTER JOIN     resources ON resrsview.resource_id = resources.resource_id LEFT OUTER JOIN     resource_std ON resources.resource_std = resource_std.resource_std;
CREATE VIEW rrwrrestr AS (SELECT wrhwr.bl_id,bl.name,wrhwr.tr_id,wrhwr.date_assigned,wrhwr.time_assigned,wrhwr.prob_type,wrhwr.fl_id, wrhwr.rm_id,'' AS resource_name,0 AS quantity,resrmview.rm_arrange_type_id,resrmview.guests_internal+resrmview.guests_external AS total_guest, wrhwr.requestor,wrhwr.phone,wrhwr.dv_id,wrhwr.dp_id,wrhwr.description,bl.ctry_id,bl.site_id,wrhwr.res_id,wrhwr.status, wrhwr.vn_id,resrmview.config_id FROM     wrhwr LEFT OUTER JOIN     resview ON wrhwr.res_id = resview.res_id LEFT OUTER JOIN     resrmview ON wrhwr.rmres_id = resrmview.rmres_id LEFT OUTER JOIN     bl ON wrhwr.bl_id = bl.bl_id WHERE      (wrhwr.tr_id IS NOT NULL OR wrhwr.vn_id IS NOT NULL) AND      wrhwr.rmres_id IS NOT NULL) UNION ALL (SELECT    wrhwr.bl_id,bl.name,wrhwr.tr_id,wrhwr.date_assigned,wrhwr.time_assigned,wrhwr.prob_type,wrhwr.fl_id,wrhwr.rm_id, 	resources.resource_name,resrsview.quantity,'' AS rm_arrange_type_id, 0 AS total_guest,wrhwr.requestor,wrhwr.phone,wrhwr.dv_id, 	wrhwr.dp_id,wrhwr.description,bl.ctry_id,bl.site_id,wrhwr.res_id,wrhwr.status, wrhwr.vn_id,'' AS config_id FROM     wrhwr LEFT OUTER JOIN     resview ON wrhwr.res_id = resview.res_id LEFT OUTER JOIN     resrsview ON wrhwr.rsres_id = resrsview.rsres_id LEFT OUTER JOIN     bl ON wrhwr.bl_id = bl.bl_id LEFT OUTER JOIN     resources ON resrsview.resource_id = resources.resource_id WHERE     (wrhwr.tr_id IS NOT NULL OR wrhwr.vn_id IS NOT NULL) AND 	 wrhwr.rsres_id IS NOT NULL);
CREATE VIEW rrdayrmocc  AS SELECT  ISNULL(resrmview.status,'') AS status,						(CASE WHEN year(resrmview.date_start) = '' THEN 						null 						ELSE 						(CAST(year(resrmview.date_start) AS VARCHAR(4)) + '-' + 						(CASE WHEN MONTH(resrmview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrmview.date_start) AS VARCHAR(2))) 						END) AS monthtxt,						(CASE WHEN  CONVERT(VARCHAR,resrmview.time_end) = '12:00AM' THEN 						DATEDIFF(hh,CONVERT(VARCHAR,resrmview.date_start)+' '+CONVERT(VARCHAR,resrmview.time_start), 						CONVERT(VARCHAR(10),DATEADD(DAY,1,CONVERT(VARCHAR(50),resrmview.date_start)))+' '+ 						CONVERT(VARCHAR,resrmview.time_end)) 						ELSE  DATEDIFF(hh,resrmview.time_start,resrmview.time_end) END) AS 						total_hours, 	rm_arrange.rm_arrange_type_id,resrmview.rmres_id,resrmview.res_id,rm_arrange.config_id,resrmview.date_start,    (rm_arrange.bl_id + ' ' + rm_arrange.fl_id + ' ' + rm_arrange.rm_id + ' ' + rm_arrange.config_id + ' ' + rm_arrange.rm_arrange_type_id) AS rm_arrange_type,    resrmview.time_start,resrmview.time_end,bl.ctry_id,bl.site_id,rm_arrange.bl_id,	rm_arrange.fl_id,rm_arrange.rm_id FROM     rm_arrange LEFT OUTER JOIN     resrmview ON rm_arrange.bl_id = resrmview.bl_id AND 	rm_arrange.fl_id = resrmview.fl_id AND 	rm_arrange.rm_id = resrmview.rm_id AND    rm_arrange.config_id = resrmview.config_id 	 AND rm_arrange.rm_arrange_type_id = resrmview.rm_arrange_type_id 	LEFT OUTER JOIN rm ON rm.bl_id = resrmview.bl_id AND 	rm.fl_id = resrmview.fl_id AND rm.rm_id = resrmview.rm_id 	LEFT OUTER JOIN bl ON rm_arrange.bl_id = bl.bl_id;
CREATE VIEW rrdayresocc AS SELECT  (CASE WHEN year(resrsview.date_start) = '' 	THEN null ELSE(CAST(year(resrsview.date_start) AS CHAR) + '-' +(CASE WHEN MONTH(resrsview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrsview.date_start) AS CHAR)) END) AS monthtxt,						(CASE WHEN  CONVERT(VARCHAR,resrsview.time_end) = '12:00AM' THEN 						DATEDIFF(hh,CONVERT(VARCHAR,resrsview.date_start)+' '+CONVERT(VARCHAR,resrsview.time_start), 						CONVERT(VARCHAR(10),DATEADD(DAY,1,CONVERT(VARCHAR(50),resrsview.date_start)))+' '+ 						CONVERT(VARCHAR,resrsview.time_end)) 						ELSE  DATEDIFF(hh,resrsview.time_start,resrsview.time_end) END) AS 						total_hours, resource_std.resource_name || ' (' || (SELECT count(resource_id) FROM resources AS res2 WHERE res2.resource_std = resources.resource_std) || ')' AS resource_name, 	resrsview.resource_id,resrsview.status,resrsview.time_start,resrsview.time_end,bl.ctry_id,bl.site_id,resrsview.bl_id, 	resrsview.date_start,resrsview.rsres_id,resrsview.res_id,resource_std.resource_std FROM    resrsview LEFT OUTER JOIN     resources ON resources.resource_id = resrsview.resource_id LEFT OUTER JOIN     resource_std ON resource_std.resource_std = resources.resource_std LEFT OUTER JOIN     bl ON resrsview.bl_id = bl.bl_id;
CREATE VIEW rrmonthresquant AS SELECT  (CASE WHEN year(resrsview.date_start) = '' 	THEN null ELSE(CAST(year(resrsview.date_start) AS CHAR) + '-' +(CASE WHEN MONTH(resrsview.date_start) < 10 THEN '0' ELSE '' END) + CAST(MONTH(resrsview.date_start) AS CHAR)) END) AS monthtxt, resrsview.quantity as total_quantity, resource_std.resource_name || ' (' || (SELECT count(resource_id) FROM resources AS res2 WHERE res2.resource_std = resources.resource_std) || ')' AS resource_name, 	resrsview.resource_id,resrsview.status,resrsview.time_start,resrsview.time_end,bl.ctry_id,bl.site_id,resrsview.bl_id, 	resrsview.date_start,resrsview.rsres_id,resrsview.res_id,resource_std.resource_std FROM    resrsview LEFT OUTER JOIN     resources ON resources.resource_id = resrsview.resource_id LEFT OUTER JOIN     resource_std ON resource_std.resource_std = resources.resource_std LEFT OUTER JOIN     bl ON resrsview.bl_id = bl.bl_id;
