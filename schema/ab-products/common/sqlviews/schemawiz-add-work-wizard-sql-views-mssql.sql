INSERT INTO afm_flds_lang (table_name, field_name) SELECT table_name, field_name FROM afm_flds WHERE NOT EXISTS (SELECT 1 FROM afm_flds_lang afm_flds_lang_inner WHERE afm_flds_lang_inner.table_name = afm_flds.table_name AND afm_flds_lang_inner.field_name = afm_flds.field_name) AND afm_flds.table_name IN ('wohwo','wrhwr','wrview');

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS AS C, INFORMATION_SCHEMA.TABLES AS T WHERE C.table_schema = T.table_schema AND C.table_name = T.table_name AND T.table_type = 'BASE TABLE' AND T.table_name <> 'dtproperties' AND C.table_name = 'wr' AND C.column_name = 'satisfaction') ALTER TABLE wr ADD satisfaction SMALLINT NULL DEFAULT 0;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS AS C, INFORMATION_SCHEMA.TABLES AS T WHERE C.table_schema = T.table_schema AND C.table_name = T.table_name AND T.table_type = 'BASE TABLE' AND T.table_name <> 'dtproperties' AND C.table_name = 'wr' AND C.column_name = 'satisfaction_notes') ALTER TABLE wr ADD satisfaction_notes VARCHAR(500) NULL DEFAULT NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS AS C, INFORMATION_SCHEMA.TABLES AS T WHERE C.table_schema = T.table_schema AND C.table_name = T.table_name AND T.table_type = 'BASE TABLE' AND T.table_name <> 'dtproperties' AND C.table_name = 'hwr' AND C.column_name = 'satisfaction') ALTER TABLE hwr ADD satisfaction SMALLINT NULL DEFAULT 0;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS AS C, INFORMATION_SCHEMA.TABLES AS T WHERE C.table_schema = T.table_schema AND C.table_name = T.table_name AND T.table_type = 'BASE TABLE' AND T.table_name <> 'dtproperties' AND C.table_name = 'hwr' AND C.column_name = 'satisfaction_notes') ALTER TABLE hwr ADD satisfaction_notes VARCHAR(500) NULL DEFAULT NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS AS C, INFORMATION_SCHEMA.TABLES AS T WHERE C.table_schema = T.table_schema AND C.table_name = T.table_name AND T.table_type = 'BASE TABLE' AND T.table_name <> 'dtproperties' AND C.table_name = 'afm_groups' AND C.column_name = 'ww_preferences') ALTER TABLE afm_groups ADD ww_preferences VARCHAR(5000) NULL DEFAULT NULL;

IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wohwo')) DROP VIEW wohwo;
CREATE VIEW wohwo AS (SELECT ac_id,bl_id,cost_estimated,cost_labor,cost_other,cost_parts,cost_tools,cost_total,date_assigned,date_closed,date_completed,date_created,date_issued,description,dp_id,dv_id,name_authorized,name_of_contact,name_of_planner,option1,option2,priority,qty_open_wr,supervisor,time_assigned,time_closed,time_completed,time_created,time_issued,tr_id,wo_id,wo_type,work_team_id FROM wo) UNION ALL (SELECT ac_id,bl_id,cost_estimated,cost_labor,cost_other,cost_parts,cost_tools,cost_total,date_assigned,date_closed,date_completed,date_created,date_issued,description,dp_id,dv_id,name_authorized,name_of_contact,name_of_planner,option1,option2,priority,qty_open_wr,supervisor,time_assigned,time_closed,time_completed,time_created,time_issued,tr_id,wo_id,wo_type,work_team_id FROM hwo);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrhwr')) DROP VIEW wrhwr;
CREATE VIEW wrhwr AS (SELECT ac_id,act_labor_hours,activity_log_id,activity_type,allow_work_on_holidays,bl_id,cause_type,cf_notes,completed_by,cost_est_labor,cost_est_other,cost_est_parts,cost_est_tools,cost_est_total,cost_labor,cost_other,cost_parts,cost_tools,cost_total,curr_meter_val,date_assigned,date_closed,date_completed,date_escalation_completion,date_escalation_response,date_est_completion,date_requested,date_stat_chg,desc_other_costs,description,dispatcher,doc1,doc2,doc3,doc4,down_time,dp_id,dv_id,eq_id,escalated_completion,escalated_response,est_labor_hours,fl_id,location,manager,msg_delivery_status,option1,option2,phone,pmp_id,pms_id,priority,prob_type,repair_type,requestor,res_id,rm_id,rmres_id,rsres_id,satisfaction,satisfaction_notes,serv_window_days,serv_window_end,serv_window_start,site_id,status,step_status,supervisor,time_assigned,time_completed,time_escalation_completion,time_escalation_response,time_requested,time_stat_chg,tr_id,vn_id,wo_id,work_team_id,wr_id,lon,lat,geo_objectid,date_esc_comp_orig, date_esc_resp_orig, time_esc_comp_orig, time_esc_resp_orig, parent_wr_id, priority_label, request_params_updated, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END FROM wr) UNION ALL (SELECT ac_id,act_labor_hours,activity_log_id,activity_type,allow_work_on_holidays,bl_id,cause_type,cf_notes,completed_by,cost_est_labor,cost_est_other,cost_est_parts,cost_est_tools,cost_est_total,cost_labor,cost_other,cost_parts,cost_tools,cost_total,curr_meter_val,date_assigned,date_closed,date_completed,date_escalation_completion,date_escalation_response,date_est_completion,date_requested,date_stat_chg,desc_other_costs,description,dispatcher,doc1,doc2,doc3,doc4,down_time,dp_id,dv_id,eq_id,escalated_completion,escalated_response,est_labor_hours,fl_id,location,manager,msg_delivery_status,option1,option2,phone,pmp_id,pms_id,priority,prob_type,repair_type,requestor,res_id,rm_id,rmres_id,rsres_id,satisfaction,satisfaction_notes,serv_window_days,serv_window_end,serv_window_start,site_id,status,step_status,supervisor,time_assigned,time_completed,time_escalation_completion,time_escalation_response,time_requested,time_stat_chg,tr_id,vn_id,wo_id,work_team_id,wr_id,lon,lat,geo_objectid,date_esc_comp_orig, date_esc_resp_orig, time_esc_comp_orig, time_esc_resp_orig, parent_wr_id, priority_label, request_params_updated, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END FROM hwr);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrview')) DROP VIEW wrview;
CREATE VIEW wrview AS (SELECT ac_id,act_labor_hours,activity_log_id,activity_type,allow_work_on_holidays,bl_id,cause_type,cf_notes,completed_by,cost_est_labor,cost_est_other,cost_est_parts,cost_est_tools,cost_est_total,cost_labor,cost_other,cost_parts,cost_tools,cost_total,curr_meter_val,date_assigned,date_closed,date_completed,date_escalation_completion,date_escalation_response,date_est_completion,date_requested,date_stat_chg,desc_other_costs,description,dispatcher,doc1,doc2,doc3,doc4,down_time,dp_id,dv_id,eq_id,escalated_completion,escalated_response,est_labor_hours,fl_id,location,manager,msg_delivery_status,option1,option2,phone,pmp_id,pms_id,priority,prob_type,repair_type,requestor,res_id,rm_id,rmres_id,rsres_id,satisfaction,satisfaction_notes,serv_window_days,serv_window_end,serv_window_start,site_id,status,step_status,supervisor,time_assigned,time_completed,time_escalation_completion,time_escalation_response,time_requested,time_stat_chg,tr_id,vn_id,wo_id,work_team_id,wr_id, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END FROM wr) UNION ALL (SELECT ac_id,act_labor_hours,activity_log_id,activity_type,allow_work_on_holidays,bl_id,cause_type,cf_notes,completed_by,cost_est_labor,cost_est_other,cost_est_parts,cost_est_tools,cost_est_total,cost_labor,cost_other,cost_parts,cost_tools,cost_total,curr_meter_val,date_assigned,date_closed,date_completed,date_escalation_completion,date_escalation_response,date_est_completion,date_requested,date_stat_chg,desc_other_costs,description,dispatcher,doc1,doc2,doc3,doc4,down_time,dp_id,dv_id,eq_id,escalated_completion,escalated_response,est_labor_hours,fl_id,location,manager,msg_delivery_status,option1,option2,phone,pmp_id,pms_id,priority,prob_type,repair_type,requestor,res_id,rm_id,rmres_id,rsres_id,satisfaction,satisfaction_notes,serv_window_days,serv_window_end,serv_window_start,site_id,status,step_status,supervisor,time_assigned,time_completed,time_escalation_completion,time_escalation_response,time_requested,time_stat_chg,tr_id,vn_id,wo_id,work_team_id,wr_id, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END FROM hwr);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrcfhwrcf')) DROP VIEW wrcfhwrcf;
CREATE VIEW wrcfhwrcf AS (SELECT cf_id,comments,cost_double,cost_estimated,cost_over,cost_straight,cost_total,date_assigned,date_end,date_start,hours_diff,hours_double,hours_est,hours_over,hours_straight,hours_total,msg_delivery_status,scheduled_from_tr_id,status_from_remote_cf,time_assigned,time_end,time_start,work_type,wr_id FROM wrcf) UNION ALL (SELECT cf_id,comments,cost_double,cost_estimated,cost_over,cost_straight,cost_total,date_assigned,date_end,date_start,hours_diff,hours_double,hours_est,hours_over,hours_straight,hours_total,msg_delivery_status,scheduled_from_tr_id,status_from_remote_cf,time_assigned,time_end,time_start,work_type,wr_id FROM hwrcf);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrpthwrpt')) DROP VIEW wrpthwrpt;
CREATE VIEW wrpthwrpt AS (SELECT comments,cost_actual,cost_estimated,date_assigned,debited,part_id,qty_actual,qty_estimated,qty_picked,status,time_assigned,wr_id FROM wrpt) UNION ALL (SELECT comments,cost_actual,cost_estimated,date_assigned,debited,part_id,qty_actual,qty_estimated,qty_picked,status,time_assigned,wr_id FROM hwrpt);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrstat')) DROP VIEW wrstat;
CREATE VIEW wrstat AS SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, prob_type, status, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END, COUNT(*) AS count_wr, SUM( est_labor_hours ) AS est_labor_sum, SUM( act_labor_hours ) AS act_labor_sum, (SUM(act_labor_hours) - SUM(est_labor_hours)) / COUNT(*) AS avg_labor_dif, SUM( cost_est_total ) AS est_cost_sum, SUM( cost_total ) AS act_cost_sum, (SUM(cost_total) - SUM(cost_est_total)) / COUNT(*) AS avg_cost_dif FROM wr GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , prob_type, status;
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wrhwrstat')) DROP VIEW wrhwrstat;
CREATE VIEW wrhwrstat AS(SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, prob_type, status, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END, COUNT(*) AS count_wr, SUM( est_labor_hours ) AS est_labor_sum, SUM( act_labor_hours ) AS act_labor_sum, (SUM(act_labor_hours) - SUM(est_labor_hours)) / COUNT(*) AS avg_labor_dif, SUM( cost_est_total ) AS est_cost_sum, SUM( cost_total ) AS act_cost_sum, (SUM(cost_total) - SUM(cost_est_total)) / COUNT(*) AS avg_cost_dif FROM wr GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , prob_type, status) UNION ALL (SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, prob_type, status, status_sort =  CASE status WHEN 'R' THEN 0 WHEN 'Rev' THEN 1 WHEN 'Rej' THEN 2 WHEN 'A' THEN 3 WHEN 'AA' THEN 4 WHEN 'I' THEN 5 WHEN 'HP' THEN 6 WHEN 'HA' THEN 6 WHEN 'HL' THEN 6 WHEN 'S' THEN 7 WHEN 'Can' THEN 8 WHEN 'Com' THEN 9  ELSE 10 END, COUNT(*) AS count_wr, SUM( est_labor_hours ) AS est_labor_sum, SUM( act_labor_hours ) AS act_labor_sum, (SUM(act_labor_hours) - SUM(est_labor_hours)) / COUNT(*) AS avg_labor_dif, SUM( cost_est_total ) AS est_cost_sum, SUM( cost_total ) AS act_cost_sum, (SUM(cost_total) - SUM(cost_est_total)) / COUNT(*) AS avg_cost_dif FROM hwr GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , prob_type, status);
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wostat')) DROP VIEW wostat;
CREATE VIEW wostat AS SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, wo_type, tr_id, is_complete = CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END, COUNT(*) AS count_wo,  SUM( cost_estimated ) AS est_cost_sum,  SUM( cost_total ) AS act_cost_sum,  (SUM(cost_total) - SUM(cost_estimated)) / COUNT(*) AS avg_cost_dif FROM wo GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , wo_type, tr_id,  CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END;
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.VIEWS AS V WHERE LOWER(table_name) = LOWER('wohwostat')) DROP VIEW wohwostat;
CREATE VIEW wohwostat AS(SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, wo_type, tr_id, is_complete = CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END, COUNT(*) AS count_wo,  SUM( cost_estimated ) AS est_cost_sum,  SUM( cost_total ) AS act_cost_sum,  (SUM(cost_total) - SUM(cost_estimated)) / COUNT(*) AS avg_cost_dif FROM wo GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , wo_type, tr_id,  CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END) UNION ALL (SELECT CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END  AS perform_date, wo_type, tr_id, is_complete = CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END, COUNT(*) AS count_wo,  SUM( cost_estimated ) AS est_cost_sum,  SUM( cost_total ) AS act_cost_sum,  (SUM(cost_total) - SUM(cost_estimated)) / COUNT(*) AS avg_cost_dif FROM hwo GROUP BY CAST( DATEPART( YEAR, date_assigned ) AS CHAR(4)) + '-' + CASE WHEN CAST( DATEPART( MONTH, date_assigned ) AS int) < 10 THEN '0' + CAST( DATEPART( MONTH, date_assigned )AS CHAR(1)) ELSE CAST( DATEPART( MONTH, date_assigned ) AS CHAR(2)) END , wo_type, tr_id,  CASE date_completed WHEN NULL THEN 'Open' ELSE 'Complete' END);
IF NOT EXISTS (SELECT 1 FROM sysobjects a INNER JOIN(SELECT name, id FROM sysobjects WHERE xtype = 'U') b on (a.parent_obj = b.id) INNER JOIN syscomments c ON (a.id = c.id) INNER JOIN syscolumns d ON (d.cdefault = a.id) WHERE a.xtype = 'D' AND b.name = 'wr' AND d.name = 'time_requested') ALTER TABLE wr ADD CONSTRAINT DF_wr_time_requested_default DEFAULT getdate() FOR time_requested;