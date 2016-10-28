package com.nanites.tbs.web.controller.user;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nanites.tbs.business.bo.ResponseEntity;
import com.nanites.tbs.business.bo.user.UserEntity;
import com.nanites.tbs.business.service.impl.user.UserServiceImpl;
import com.nanites.tbs.business.type.response.Param;
import com.nanites.tbs.business.util.CommonUtil;
import com.nanites.tbs.business.util.SearchInput;

@Controller
@RequestMapping("/user")
public class UserController implements ResourceLoaderAware{
	private static final Logger logger = Logger.getLogger(UserController.class);
	
	// instance
	@Autowired
	private UserServiceImpl userService;
	@Autowired
	private ObjectMapper objectMapper;
	private ResourceLoader resourceLoader;
	
	// setter-getter
	
	@Override
	public void setResourceLoader(ResourceLoader resourceLoader) {
		this.resourceLoader = resourceLoader;
	}
	
	// web

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity save(@RequestBody UserEntity user) {
		logger.info(user);
		user = userService.save(user);
		ResponseEntity response = new ResponseEntity();
		response.setResponseEntity(user);
		return response;
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity update(@RequestBody UserEntity user) {
		user = userService.update(user);
		ResponseEntity response = new ResponseEntity();
		response.setResponseEntity(user);
		return response;
	}
	
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	public @ResponseBody ResponseEntity get(@RequestParam("userID") long userID) {
		UserEntity user = userService.get(userID);
		ResponseEntity response = new ResponseEntity();
		response.setResponseEntity(user);
		return response;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public @ResponseBody List<UserEntity> list() {
		return userService.list();
	}
	
	@RequestMapping(value = "/listBySeach", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity listBySeach(@RequestBody SearchInput searchInput) {
		if (!CommonUtil.isAdmin()) {
			searchInput.getSearchData().put(Param.EMAIL_ID.getDesc(), CommonUtil.fetchLoginID());
		}

		List<UserEntity> complaintList = userService.list(searchInput);
		long rowCount = userService.getTotalRowCount(searchInput);

		Map<String, String> respMap = new HashMap<String, String>();
		respMap.put(Param.ROW_COUNT.getDesc(), String.valueOf(rowCount));
		respMap.put(Param.CURRENT_PAGE_NO.getDesc(), String.valueOf(searchInput.getPageNo()));
		respMap.put(Param.TOTAL_PAGE_COUNT.getDesc(), String.valueOf(CommonUtil.calculateNoOfPages(rowCount, searchInput.getRowsPerPage())));
		respMap.put(Param.ROWS_PER_PAGE.getDesc(), String.valueOf(searchInput.getRowsPerPage()));

		ResponseEntity response = new ResponseEntity();
		response.setResponseData(respMap);
		response.setResponseEntity(complaintList);

		return response;
	}
	
	// data

	/**
	 * http://localhost:8080/tbs/ctrl/user/getBanner
	 * 
	 * @return
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getColumnData", method = RequestMethod.GET)
	public @ResponseBody List<Object> getColumnData() throws IOException {
		Resource messageColumnJson = null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(CommonUtil.isAuth(auth)) {
			Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>) auth.getAuthorities();
			if(CommonUtil.isAdmin(authorities)) {
				messageColumnJson = this.resourceLoader.getResource("classpath:data/json/user/userColumnDataAdmin.json");
			}
			else {
				messageColumnJson = this.resourceLoader.getResource("classpath:data/json/user/userColumnDataMember.json");
			}
		}
		List<Object> patientColumnData = objectMapper.readValue(messageColumnJson.getFile(), List.class);
		logger.info("getPatientColumnData: " + patientColumnData);
		return patientColumnData;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getWizzardData", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> getWizzardData() throws IOException {
		Resource messageFormData = this.resourceLoader.getResource("classpath:data/json/user/userWizzardData.json");
		Map<String, Object> messageFormDataMap = objectMapper.readValue(messageFormData.getFile(), Map.class);
		logger.info("getMessageFormData: " + messageFormDataMap);
		
		return messageFormDataMap;
	}		
	
	@RequestMapping(value = "/updatePassword", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity updatePassword(@RequestParam("currentPassword") String currentPassword, @RequestParam("newPassword") String newPassword) throws ClassNotFoundException, IOException {
		UserEntity user = userService.get(CommonUtil.fetchLoginID());
		if(StringUtils.isNotEmpty(currentPassword) && StringUtils.isNotEmpty(newPassword) && currentPassword.equals(user.getBasicDetail().getPassword())) {
			user.getBasicDetail().setPassword(newPassword);
			userService.update(user);
			return ResponseEntity.Success();			
		}
		return ResponseEntity.Fail();			
	}
}
