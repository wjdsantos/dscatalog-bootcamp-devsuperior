package com.devsuperior.dscatalog.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.devsuperior.dscatalog.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {


	/*
	 * @Query("SELECT obj FROM Category obj WHERE " +
	 * "(:name = '' OR LOWER(obj.name) LIKE LOWER(CONCAT('%',:name,'%'))) " )
	 * Page<Category> find(Pageable pageble);
	 */


	@Query("SELECT obj FROM Category obj WHERE obj IN :categories")
	List<Category> find(List<Category> categories);
	
	
//	@Query("SELECT obj FROM Category obj")
//	List<Category> find();

}
