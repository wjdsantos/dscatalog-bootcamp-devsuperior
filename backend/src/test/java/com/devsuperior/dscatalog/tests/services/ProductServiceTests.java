package com.devsuperior.dscatalog.tests.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.entities.Product;
import com.devsuperior.dscatalog.repositories.ProductRepository;
import com.devsuperior.dscatalog.services.ProductService;
import com.devsuperior.dscatalog.services.exceptions.DatabaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;
import com.devsuperior.dscatalog.tests.factory.ProductFactory;

/**
 * @author Walter
 *
 */
@ExtendWith(SpringExtension.class)  //Não carrega o contexto da aplicação - Não vai ter os Bean´s da aplicação carregados, não vai ter
									//o container de injeção de dependencia normal carregado; Então nesse caso vai ser usado o Mokito vanila
public class ProductServiceTests {

	@InjectMocks
	private ProductService service;
	
	@Mock
	private ProductRepository repository;
	
	private long existingId;
	private long nonExistingId;
	private long dependentId;
	private Product product;
//	private ProductDTO dto;
	private PageImpl<Product> page;  //PageImpl é uma implementação de página
//	private PageRequest pageRequest;
	
	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 1000L;
		dependentId = 4L;
		product = ProductFactory.createProduct();
		page = new PageImpl<>(List.of(product));  //O List.of() aceita um objeto como argumento
		
		Mockito.when(repository.find(ArgumentMatchers.any(), ArgumentMatchers.anyString(), ArgumentMatchers.any()))
			.thenReturn(page);
		
		Mockito.when(repository.save(ArgumentMatchers.any())).thenReturn(product);
		
		Mockito.when(repository.findById(existingId)).thenReturn(Optional.of(product));
		Mockito.when(repository.findById(nonExistingId)).thenReturn(Optional.empty());
		
		Mockito.when(repository.getOne(existingId)).thenReturn(product); //Exer. 6-30
		Mockito.doThrow(EntityNotFoundException.class).when(repository).getOne(nonExistingId); //Exer. 6-30
		
		Mockito.doNothing().when(repository).deleteById(existingId);
		Mockito.doThrow(EmptyResultDataAccessException.class).when(repository).deleteById(nonExistingId);
		Mockito.doThrow(DataIntegrityViolationException.class).when(repository).deleteById(dependentId);
	}

	//Exer. 6-30
	@Test
	public void updateShouldthrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		
		ProductDTO dto = new ProductDTO();
		
		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.update(nonExistingId, dto);
		});
	}
	
	/*
	 * //Exer. 6-30
	 * 
	 * @Test public void updateShouldReturnProductDTOWhenIdExists() {
	 * 
	 * ProductDTO dto = new ProductDTO();
	 * 
	 * ProductDTO result = service.update(existingId, dto);
	 * 
	 * Assertions.assertNotNull(result); }
	 */
	
	//Exer. 6-30
	@Test
	public void findByIdShouldthrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		
		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.findById(nonExistingId);
		});
	}
	
	//Exer. 6-30
	@Test
	public void findByIdShouldReturnProductDTOWhenIdExists() {
		
		ProductDTO result = service.findById(existingId);
		
		Assertions.assertNotNull(result);
	}
	
	//Exer. 6-30
	@Test
	public void findAllPagedShouldReturnPage() {
		
		Long categoryId = 0L;
		String name = "";
		PageRequest pageRequest = PageRequest.of(0,  10);
		
		Page<ProductDTO> result = service.findAllPaged(categoryId, name, pageRequest);
		
		Assertions.assertNotNull(result);
		Assertions.assertFalse(result.isEmpty());
		Mockito.verify(repository, Mockito.times(1)).find(null, name, pageRequest);
	}
	
	@Test
	public void deleteShouldthrowDatabaseExceptionWhenDependentId() {
		
		Assertions.assertThrows(DatabaseException.class, () -> {
			service.delete(dependentId);
		});
		
		Mockito.verify(repository, Mockito.times(1)).deleteById(dependentId);
	}
	
	@Test
	public void deleteShouldthrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		
		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.delete(nonExistingId);
		});
		
		Mockito.verify(repository, Mockito.times(1)).deleteById(nonExistingId);
	}
	
	@Test
	public void deleteShoulDoNothingWhenIdExists() {
		
		Assertions.assertDoesNotThrow(() -> {
			service.delete(existingId);
		});
		
		Mockito.verify(repository, Mockito.times(1)).deleteById(existingId);
	}
	
	//Note que a classe Mokito é sempre citada para chamr seu método, ex.: Mockito.doNothing()... ; Mockito.doThrow(...)...
	//mas é possível fazer um import static. Se removermos todos os Mockito´s e acionarmos ctrl+shift+o a IDE irá resolver as 
	//inconcistencias inserindo import´s static da classe com o método, ex.:
	//import static org.mockito.Mockito.doNothing;
	//import static org.mockito.Mockito.doThrow;
	//Mas para efeito didático vamos manter as chamadas das classes com seus métodos onde for necessário
}
