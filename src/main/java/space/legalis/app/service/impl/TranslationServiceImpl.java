package space.legalis.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import space.legalis.app.domain.Translation;
import space.legalis.app.repository.TranslationRepository;
import space.legalis.app.service.TranslationService;

/**
 * Service Implementation for managing {@link Translation}.
 */
@Service
public class TranslationServiceImpl implements TranslationService {

    private final Logger log = LoggerFactory.getLogger(TranslationServiceImpl.class);

    private final TranslationRepository translationRepository;

    public TranslationServiceImpl(TranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    @Override
    public Translation save(Translation translation) {
        log.debug("Request to save Translation : {}", translation);
        return translationRepository.save(translation);
    }

    @Override
    public Optional<Translation> partialUpdate(Translation translation) {
        log.debug("Request to partially update Translation : {}", translation);

        return translationRepository
            .findById(translation.getId())
            .map(existingTranslation -> {
                if (translation.getNote() != null) {
                    existingTranslation.setNote(translation.getNote());
                }
                if (translation.getAuthor() != null) {
                    existingTranslation.setAuthor(translation.getAuthor());
                }
                if (translation.getSource() != null) {
                    existingTranslation.setSource(translation.getSource());
                }
                if (translation.getOfficial() != null) {
                    existingTranslation.setOfficial(translation.getOfficial());
                }
                if (translation.getContent() != null) {
                    existingTranslation.setContent(translation.getContent());
                }

                return existingTranslation;
            })
            .map(translationRepository::save);
    }

    @Override
    public List<Translation> findAll() {
        log.debug("Request to get all Translations");
        return translationRepository.findAll();
    }

    @Override
    public Optional<Translation> findOne(String id) {
        log.debug("Request to get Translation : {}", id);
        return translationRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Translation : {}", id);
        translationRepository.deleteById(id);
    }
}
