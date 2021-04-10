package com.devsuperior.dscatalog.tests.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.services.ProductService;
import com.devsuperior.dscatalog.services.exceptions.DatabaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;
import com.devsuperior.dscatalog.tests.factory.ProductFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest  //Vai carregar o contexto
@AutoConfigureMockMvc //Para não carregar o servidor Tomcat
public class ProductResourceTests {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean  //Carregando o contexto trocando o ProductService
	private ProductService service;
	
	@Autowired
	private ObjectMapper objectMapper;

	@Value("${security.oauth2.client.client-id}")
	private String clientId;
	
	@Value("${security.oauth2.client.client-secret}")
	private String clientSecret;
	
	private Long existingId;
	private Long nonExistingId;
	private Long dependentId;
	private ProductDTO newProductDTO;
	private ProductDTO existingProductDTO;
	private PageImpl<ProductDTO> page;
	
	private String operatorUsername;
	private String operatorPassword;
	
	@BeforeEach
	void setUp() throws Exception {
	
		operatorUsername = "alex@gmail.com";
		operatorPassword = "123456";
		
		existingId = 1L;
		nonExistingId = 2L;
		dependentId = 3L;
		
		newProductDTO = ProductFactory.createProductDTO(null);
		existingProductDTO = ProductFactory.createProductDTO(existingId);
		
		page = new PageImpl<>(List.of(existingProductDTO));
		
		when(service.findById(existingId)).thenReturn(existingProductDTO);
		when(service.findById(nonExistingId)).thenThrow(ResourceNotFoundException.class);
		
		when(service.findAllPaged(any(), any(), any())).thenReturn(page);
		
		when(service.insert(any())).thenReturn(existingProductDTO);
		
		when(service.update(eq(existingId), any())).thenReturn(existingProductDTO);
		when(service.update(eq(nonExistingId), any())).thenThrow(ResourceNotFoundException.class);
		
		doNothing().when(service).delete(existingId);
		doThrow(ResourceNotFoundException.class).when(service).delete(nonExistingId);
		doThrow(DatabaseException.class).when(service).delete(dependentId);
	}

	// Testando endpoint DELETE retornando not found quando ID não existe
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {

		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		ResultActions result =
				mockMvc.perform(delete("/products/{id}", nonExistingId)
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho do token
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNotFound());
	}
	
	// Testando endpoint DELETE retornando no content quando ID existe
	@Test
	public void deleteShouldReturnNoContentWhenIdExists() throws Exception {

		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		ResultActions result =
				mockMvc.perform(delete("/products/{id}", existingId)
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho do token
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNoContent());
	}
	
	// Exercicio. 06-39
	// Testando retorno Unprocessable entity(422) no endpoint POST (insert) quando o preço não for positivo
	@Test
	public void insertShouldReturnUnprocessableEntityWhenNegativePrice() throws Exception {
		
		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		newProductDTO.setPrice(-10.0);
		String jsonBody = objectMapper.writeValueAsString(newProductDTO); //Convertendo obj. Java p/ Json

		ResultActions result =
				mockMvc.perform(post("/products")
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho + Bearer + token
					.content(jsonBody)									//Passando Json como corpo da requisição
					.contentType(MediaType.APPLICATION_JSON)			//Configurando MediaType do mockMvc p/ Json
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isUnprocessableEntity());
	}
	
	// Exercicio. 06-39
	// Testando endpoint POST (insert) quando os dados forem válidos 
	@Test
	public void insertShouldReturnCreatedWhenValidData() throws Exception {
		
		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		String jsonBody = objectMapper.writeValueAsString(newProductDTO); //Convertendo obj. Java p/ Json

		ResultActions result =
				mockMvc.perform(post("/products")
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho + Bearer + token
					.content(jsonBody)									//Passando Json como corpo da requisição
					.contentType(MediaType.APPLICATION_JSON)			//Configurando MediaType do mockMvc p/ Json
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isCreated());
		result.andExpect(jsonPath("$.id").exists()); //Acrescentado na correção
	}
	
	// Testando endpoint PUT quando ID existe
	@Test
	public void updateShouldReturnProductDTOWhenIdtExists() throws Exception {

		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		String jsonBody = objectMapper.writeValueAsString(newProductDTO); //Convertendo obj. Java p/ Json
		
		String expectedName = newProductDTO.getName();
		Double expectedPrice = newProductDTO.getPrice();
		
		ResultActions result =
				mockMvc.perform(put("/products/{id}", existingId)
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho do token
					.content(jsonBody)									//Passando Json como corpo da requisição
					.contentType(MediaType.APPLICATION_JSON)			//Configurando MediaType do mockMvc p/ Json
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isOk());
		result.andExpect(jsonPath("$.id").exists()); //Testando se retornou algum ID
		result.andExpect(jsonPath("$.id").value(existingId));  //Testando se i ID que veio é o mesmo que foi enviado
		result.andExpect(jsonPath("$.name").value(expectedName));  //Testando se o nome do usuário é o esperado
		result.andExpect(jsonPath("$.price").value(expectedPrice)); //Testando se o preço do produto é o esperado
	}
	
	// Testando endpoint PUT (update) para ID não existente
	@Test
	public void updateShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {

		String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
		
		String jsonBody = objectMapper.writeValueAsString(newProductDTO); //Convertendo obj. Java p/ Json
		
		ResultActions result =
				mockMvc.perform(put("/products/{id}", nonExistingId)
					.header("Authorization", "Bearer " + accessToken)    //Passando o cabeçalho + Bearer + token
					.content(jsonBody)									//Passando Json como corpo da requisição
					.contentType(MediaType.APPLICATION_JSON)			//Configurando MediaType do mockMvc p/ Json
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNotFound());
	}

	@Test
	public void findAllShouldReturnPage() throws Exception {
		
		ResultActions result =
				mockMvc.perform(get("/products")
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isOk());  //Testando se o retorno é 200 
		result.andExpect(jsonPath("$.content").exists());
	}
	
	@Test
	public void findByIdShouldReturnProductWhenIdExist() throws Exception {
		
		ResultActions result =
				mockMvc.perform(get("/products/{id}", existingId)
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isOk());
		result.andExpect(jsonPath("$.id").value(existingId));
	}
	
	@Test
	public void findByIdShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
		
		ResultActions result =
				mockMvc.perform(get("/products/{id}", nonExistingId)
					.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNotFound());
	}
	
	//Função p/ obter o token (usuário e senha)
	private String obtainAccessToken(String username, String password) throws Exception {
		 
	    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	    params.add("grant_type", "password");
	    params.add("client_id", clientId);
	    params.add("username", username);
	    params.add("password", password);
	 
	    ResultActions result 
	    	= mockMvc.perform(post("/oauth/token")
	    		.params(params)
	    		.with(httpBasic(clientId, clientSecret))
	    		.accept("application/json;charset=UTF-8"))
	        	.andExpect(status().isOk())
	        	.andExpect(content().contentType("application/json;charset=UTF-8"));
	 
	    String resultString = result.andReturn().getResponse().getContentAsString();
	 
	    JacksonJsonParser jsonParser = new JacksonJsonParser();
	    return jsonParser.parseMap(resultString).get("access_token").toString();
	}	
}
