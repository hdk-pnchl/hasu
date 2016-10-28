package com.nanites.tbs.web.controller;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.nanites.tbs.business.bo.MessageEntity;
import com.nanites.tbs.business.bo.ResponseEntity;
import com.nanites.tbs.business.bo.user.UserEntity;
import com.nanites.tbs.business.service.impl.MessageServiceImpl;
import com.nanites.tbs.business.service.impl.user.UserServiceImpl;
import com.nanites.tbs.business.type.response.Param;
import com.nanites.tbs.business.util.CommonUtil;

@Controller
@RequestMapping("/core")
public class CoreController implements ResourceLoaderAware {
	private static final Logger logger = Logger.getLogger(CoreController.class);
	
	// instance
	
	private ResourceLoader resourceLoader;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private UserServiceImpl userService;
	@Autowired
	private MessageServiceImpl messageService;
	
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public void test(HttpServletRequest request, HttpServletResponse response) {
		try {
			response.getWriter().write("Yes, It works");
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	// setter-getter
	
	@Override
	public void setResourceLoader(ResourceLoader resourceLoader) {
		this.resourceLoader = resourceLoader;
	}
	
	// data
	
	/**
	 * http://localhost:8080/tbs/ctrl/core/getBannerData
	 * 
	 * @return
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getBannerData", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> getBannerData() throws IOException {
		Map<String, Object> bannerData = null;
		Resource bannerJson = null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(CommonUtil.isAuth(auth)) {
			Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>) auth.getAuthorities();
			if(CommonUtil.isAdmin(authorities)) {
				bannerJson = this.resourceLoader.getResource("classpath:data/json/banner/bannerDataAdmin.json");
			}
			else {
				bannerJson = this.resourceLoader.getResource("classpath:data/json/banner/bannerDataMember.json");
			}
			UserEntity user = userService.get(auth.getName());
			bannerData = objectMapper.readValue(bannerJson.getFile(), Map.class);
			bannerData.put(Param.USER_DATA.name(), user);
		}
		else {
			bannerJson = this.resourceLoader.getResource("classpath:data/json/banner/bannerDataGuest.json");
			bannerData = objectMapper.readValue(bannerJson.getFile(), Map.class);
		}
		logger.info("getBannerData: " + bannerData);
		
		return bannerData;
	}
	
	/**
	 * http://localhost:8080/tbs/ctrl/core/getUserData
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getUserData", method = RequestMethod.GET)
	public @ResponseBody UserEntity getUserData() throws IOException {
		UserEntity basicDetail = null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(CommonUtil.isAuth(auth)) {
			basicDetail = userService.get(auth.getName());
		}
		return basicDetail;
	}
	
	// web
	
	/**
	 * http://localhost:8080/tbs/ctrl/core/signUp
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/signUp", method = RequestMethod.POST)
	public @ResponseBody UserEntity signUp(@RequestBody UserEntity user) throws IOException {
		logger.info("Singup Request DATA : " + user);
		user = userService.save(user);
		logger.info("Singup Response DATA: " + user);
		return user;
	}
	
	/**
	 * http://localhost:8080/tbs/ctrl/core/isEmailIdTaken?emailId=hdk.pnchl@gmail.com
	 *
	 * @param emailID
	 * @return
	 */
	@RequestMapping(value = "/isEmailIdTaken", method = RequestMethod.POST)
	public @ResponseBody Map<String, Boolean> isEmailIdTaken(@RequestParam("emailID") String emailID) {
		UserEntity user = userService.get(emailID);
		Map<String, Boolean> responseMap = new HashMap<String, Boolean>();
		responseMap.put(Param.IS_EMAILID_TAKEN.name(), (user != null) ? true : false);
		return responseMap;
	}
	
	@RequestMapping(value = "/saveMessage", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity saveMessage(@RequestBody MessageEntity message) {
		System.out.println("/Core" + " : " + "/save");
		message = messageService.save(message);
		ResponseEntity response = ResponseEntity.Success();
		response.setResponseEntity(message);
		return response;
	}
	
	@RequestMapping(value = "/initiatePasswordUpdate", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity initiatePasswordUpdate(HttpServletRequest request, @RequestParam("emailID") String emailID) throws ClassNotFoundException, IOException {
		UserEntity user = userService.get(emailID);
		Map<String, String> respMap = new HashMap<String, String>();
		if(user != null) {
			String pwUpdateReqToken = UUID.randomUUID().toString();
			user.setChangePasswordReqToken(pwUpdateReqToken);
			user = userService.update(user);
			Map<String, String> pwUpdateReqMap = new HashMap<String, String>();
			pwUpdateReqMap.put(Param.EMAIL_ID.name(), emailID);
			pwUpdateReqMap.put(Param.PW_UPDATE_REQ_TOKEN.name(), pwUpdateReqToken);
			
			//http://localhost:8080/tbs-static/#/signIn
			StringBuilder pwUpdateReq = new StringBuilder(CommonUtil.buildUrl(request, "static/#/user/updateForgottenPassword/"));
			pwUpdateReq.append(CommonUtil.mapToString(pwUpdateReqMap));
			
			respMap.put(Param.SUCCESS.name(), Boolean.TRUE.toString());
			respMap.put(Param.PW_UPDATE_URL.name(), pwUpdateReq.toString());
		}
		else {
			respMap.put(Param.SUCCESS.name(), Boolean.FALSE.toString());
			respMap.put(Param.ERR_USER_DOESNT_EXISTS.name(), Boolean.TRUE.toString());			
		}
		
		return ResponseEntity.builder().responseData(respMap).build();
	}
	
	@RequestMapping(value = "/updateForgottenPassword", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity updateForgottenPassword(HttpServletRequest request, @RequestParam("token") String token, @RequestParam("newPassword") String password)
			throws ClassNotFoundException, IOException {
		Map<String, String> respMap = new HashMap<String, String>();
		respMap.put(Param.SUCCESS.name(), Boolean.FALSE.toString());
		
		Map<String, String> pwUpdateReqMap = CommonUtil.stringToMap(token);
		String emailID = pwUpdateReqMap.get(Param.EMAIL_ID.name());
		if(emailID != null) {
			UserEntity user = userService.get(emailID);
			if(user != null) {
				String reqToken= pwUpdateReqMap.get(Param.PW_UPDATE_REQ_TOKEN.name());
				if(!StringUtils.isEmpty(user.getChangePasswordReqToken()) && !StringUtils.isEmpty(reqToken)
						&& user.getChangePasswordReqToken().equals(reqToken)) {
					user.getBasicDetail().setPassword(password);
					userService.update(user);
					respMap.put(Param.SUCCESS.name(), Boolean.TRUE.toString());
				}
			}else{
				respMap.put(Param.ERR_USER_DOESNT_EXISTS.name(), Boolean.TRUE.toString());
			}
		}
		return ResponseEntity.builder().responseData(respMap).build();
	}
}
