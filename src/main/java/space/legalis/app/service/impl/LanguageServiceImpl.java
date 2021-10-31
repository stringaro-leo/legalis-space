package space.legalis.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import space.legalis.app.domain.Language;
import space.legalis.app.repository.LanguageRepository;
import space.legalis.app.service.LanguageService;

/**
 * Service Implementation for managing {@link Language}.
 */
@Service
public class LanguageServiceImpl implements LanguageService {

    private final Logger log = LoggerFactory.getLogger(LanguageServiceImpl.class);

    private final LanguageRepository languageRepository;

    public LanguageServiceImpl(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    @Override
    public Language save(Language language) {
        log.debug("Request to save Language : {}", language);
        return languageRepository.save(language);
    }

    @Override
    public Optional<Language> partialUpdate(Language language) {
        log.debug("Request to partially update Language : {}", language);

        return languageRepository
            .findById(language.getId())
            .map(existingLanguage -> {
                if (language.getCode() != null) {
                    existingLanguage.setCode(language.getCode());
                }
                if (language.getName() != null) {
                    existingLanguage.setName(language.getName());
                }

                return existingLanguage;
            })
            .map(languageRepository::save);
    }

    @Override
    public List<Language> findAll() {
        log.debug("Request to get all Languages");
        return languageRepository.findAll();
    }

    /**
     *  Get all the languages where Translation is {@code null}.
     *  @return the list of entities.
     */

    public List<Language> findAllWhereTranslationIsNull() {
        log.debug("Request to get all languages where Translation is null");
        return StreamSupport
            .stream(languageRepository.findAll().spliterator(), false)
            .filter(language -> language.getTranslation() == null)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Language> findOne(String id) {
        log.debug("Request to get Language : {}", id);
        return languageRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Language : {}", id);
        languageRepository.deleteById(id);
    }
}
