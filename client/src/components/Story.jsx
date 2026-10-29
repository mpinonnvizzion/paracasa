import './Story.css'

export default function Story() {
  return (
    <section className="story">
      <div className="story__inner">
        <blockquote className="story__quote">
          <p>
            "Growing up on the border, I watched my family spend more on fees
            than they needed to. ParaCasa was built so every dollar you send
            goes as far as possible."
          </p>
          <footer className="story__attr">— Built from the Rio Grande Valley</footer>
        </blockquote>
      </div>
    </section>
  )
}
